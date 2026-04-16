const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./db')
const { jwtSecret, port } = require('./config')

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase()
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      jti: crypto.randomUUID(),
      email: user.email,
      nickname: user.nickname,
    },
    jwtSecret,
    { expiresIn: '30d' }
  )
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function publicUser(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    email: row.email,
    avatar_url: row.avatar_url || '',
    status: row.status,
  }
}

function toTextArray(value) {
  return Array.isArray(value) ? value : []
}

function mapDestination(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    region: row.region,
    category: row.category,
    rating: row.rating === null ? '' : String(row.rating),
    coordinates: {
      longitude: Number(row.longitude),
      latitude: Number(row.latitude),
    },
    description: row.description,
    image: row.image_url || '',
    weather: row.weather || {},
    tips: toTextArray(row.tips),
    suggestion: row.suggestion || '',
    liveTitle: row.live_title || '',
    liveHint: row.live_hint || '',
    liveKeyword: row.live_keyword || '',
    culture: {
      overview: row.culture_overview || '',
      history: row.culture_history || '',
      highlights: row.culture_highlights || '',
    },
    travelMeta: {
      season: row.recommended_season || '',
      stay: row.recommended_stay || '',
      audience: row.suitable_audience || '',
    },
    visitMeta: {
      ticket: row.ticket_reference || '',
      openHours: row.open_hours || '',
    },
  }
}

function mapGuide(row, sections = []) {
  return {
    id: row.slug,
    title: row.title,
    category: row.category,
    readTime: row.read_time || '',
    author: row.author,
    publishDate: row.publish_date ? row.publish_date.toISOString().slice(0, 10) : '',
    views: row.views,
    likes: row.likes,
    location: row.location || '',
    image: row.image_url || '',
    excerpt: row.excerpt,
    highlights: toTextArray(row.highlights),
    sections,
    tips: toTextArray(row.tips),
  }
}

async function createSession(user, token, req) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await db.query(
    `
      INSERT INTO user_sessions (user_id, token_hash, device_name, ip_address, user_agent, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      user.id,
      hashToken(token),
      'uni-app',
      req.ip || null,
      req.get('user-agent') || null,
      expiresAt,
    ]
  )
}

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

app.get('/api/health', asyncRoute(async (req, res) => {
  const result = await db.query('SELECT current_database() AS database, current_user AS username')
  res.json({ ok: true, database: result.rows[0] })
}))

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const password = String(req.body.password || '')
  const nickname = String(req.body.nickname || '').trim()

  if (!nickname) {
    res.status(400).json({ message: '请输入昵称。' })
    return
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400).json({ message: '请输入正确的邮箱格式。' })
    return
  }

  if (password.length < 6) {
    res.status(400).json({ message: '密码至少 6 位。' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const result = await db.query(
      `
        INSERT INTO users (email, password_hash, nickname)
        VALUES ($1, $2, $3)
        RETURNING id, email, nickname, avatar_url, status
      `,
      [email, passwordHash, nickname]
    )
    const user = publicUser(result.rows[0])
    const token = signToken(user)
    await createSession(user, token, req)
    res.status(201).json({ token, user })
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ message: '该邮箱已注册，请直接登录。' })
      return
    }
    throw error
  }
}))

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const password = String(req.body.password || '')

  if (!email || !password) {
    res.status(400).json({ message: '请输入邮箱和密码。' })
    return
  }

  const result = await db.query(
    `
      SELECT id, email, password_hash, nickname, avatar_url, status
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  )

  const row = result.rows[0]
  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    res.status(401).json({ message: '邮箱或密码错误。' })
    return
  }

  if (row.status !== 'active') {
    res.status(403).json({ message: '账号不可用，请联系管理员。' })
    return
  }

  await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [row.id])
  const user = publicUser(row)
  const token = signToken(user)
  await createSession(user, token, req)
  res.json({ token, user })
}))

app.get('/api/destinations', asyncRoute(async (req, res) => {
  const keyword = String(req.query.keyword || '').trim()
  const category = String(req.query.category || '').trim()
  const region = String(req.query.region || '').trim()
  const params = []
  const where = ["status = 'published'"]

  if (keyword) {
    params.push(`%${keyword}%`)
    where.push(`(name ILIKE $${params.length} OR location ILIKE $${params.length} OR region ILIKE $${params.length} OR category ILIKE $${params.length})`)
  }

  if (category && category !== '全部') {
    params.push(category)
    where.push(`category = $${params.length}`)
  }

  if (region && region !== '全部') {
    params.push(region)
    where.push(`region = $${params.length}`)
  }

  const result = await db.query(
    `
      SELECT *
      FROM destinations
      WHERE ${where.join(' AND ')}
      ORDER BY sort_order ASC, id ASC
    `,
    params
  )

  res.json({ list: result.rows.map(mapDestination) })
}))

app.get('/api/destinations/:id', asyncRoute(async (req, res) => {
  const result = await db.query(
    `
      SELECT *
      FROM destinations
      WHERE id = $1 AND status = 'published'
      LIMIT 1
    `,
    [req.params.id]
  )

  if (!result.rows[0]) {
    res.status(404).json({ message: '景区不存在。' })
    return
  }

  res.json({ data: mapDestination(result.rows[0]) })
}))

app.get('/api/guides', asyncRoute(async (req, res) => {
  const result = await db.query(
    `
      SELECT *
      FROM guides
      WHERE status = 'published'
      ORDER BY sort_order ASC, publish_date DESC NULLS LAST
    `
  )
  res.json({ list: result.rows.map((row) => mapGuide(row)) })
}))

app.get('/api/guides/:slug', asyncRoute(async (req, res) => {
  const guideResult = await db.query(
    `
      SELECT *
      FROM guides
      WHERE slug = $1 AND status = 'published'
      LIMIT 1
    `,
    [req.params.slug]
  )

  const guide = guideResult.rows[0]
  if (!guide) {
    res.status(404).json({ message: '攻略不存在。' })
    return
  }

  const sectionsResult = await db.query(
    `
      SELECT title, paragraphs
      FROM guide_sections
      WHERE guide_id = $1
      ORDER BY sort_order ASC
    `,
    [guide.id]
  )

  const sections = sectionsResult.rows.map((row) => ({
    title: row.title,
    paragraphs: toTextArray(row.paragraphs),
  }))

  res.json({ data: mapGuide(guide, sections) })
}))

app.use((req, res) => {
  res.status(404).json({ message: '接口不存在。' })
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: '服务器内部错误。' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Meet Xinjiang API listening on http://0.0.0.0:${port}/api`)
})
