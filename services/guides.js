import { getGuideById, getGuideList } from '../common/guide-data'
import { API_BASE_URL, hasApiBaseUrl } from '../config/api'

function hasGuideApi() {
  return hasApiBaseUrl()
}

function request(url, data = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      data,
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }
        resolve(res.data)
      },
      fail: reject,
    })
  })
}

export async function getGuideFeed(params = {}) {
  if (!hasGuideApi()) {
    return getGuideList()
  }

  try {
    const data = await request(`${API_BASE_URL}/guides`, params)
    return Array.isArray(data?.list) ? data.list : getGuideList()
  } catch (error) {
    return getGuideList()
  }
}

export async function getGuideDetail(id) {
  if (!hasGuideApi()) {
    return getGuideById(id)
  }

  try {
    const data = await request(`${API_BASE_URL}/guides/${encodeURIComponent(id)}`)
    return data?.data || getGuideById(id)
  } catch (error) {
    return getGuideById(id)
  }
}
