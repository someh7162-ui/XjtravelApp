<template>
  <view class="page-shell">
    <view class="page-scroll">
      <view class="hero-gradient top-banner section">
        <text class="banner-title">旅行指南</text>
        <text class="banner-subtitle">行前准备、玩法建议与新疆旅行常识都在这里</text>
      </view>

      <view class="tips-shell section">
        <text class="section-title">出发前速览</text>
        <view class="tips-list">
          <view v-for="item in quickTips" :key="item.title" class="card tip-item">
            <view class="tip-icon">{{ item.short }}</view>
            <view class="tip-content">
              <text class="tip-title">{{ item.title }}</text>
              <text class="tip-desc muted-text">{{ item.description }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section section-block">
        <text class="section-title">精选攻略</text>
        <view class="guide-list">
          <view v-for="item in guides" :key="item.id" class="card guide-card">
            <view class="guide-image-wrap">
              <CachedImage :src="item.image" image-class="cover-image" />
              <view class="guide-tag">{{ item.category }}</view>
            </view>
            <view class="guide-body">
              <text class="guide-title">{{ item.title }}</text>
              <text class="guide-desc muted-text">{{ item.excerpt }}</text>
              <text class="guide-time muted-text">{{ item.readTime }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section section-block">
        <view class="info-panel">
          <text class="section-title">旅行基础信息</text>
          <view class="info-list">
            <view v-for="item in essentialInfo" :key="item.label" class="info-row">
              <view class="info-dot"></view>
              <text class="info-text">
                <text class="info-label">{{ item.label }}:</text>
                <text class="muted-text"> {{ item.value }}</text>
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-space"></view>
    </view>

    <AppTabBar current="/pages/guides/index" />
  </view>
</template>

<script setup>
import AppTabBar from '../../components/AppTabBar.vue'
import CachedImage from '../../components/CachedImage.vue'
import { essentialInfo, guides, quickTips } from '../../common/travel-guide-data'
</script>

<style scoped lang="scss">
@import '../../uni.scss';

.top-banner {
  padding-top: 88rpx;
  padding-bottom: 48rpx;
  color: #ffffff;
}

.banner-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
}

.banner-subtitle {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  opacity: 0.9;
}

.tips-shell {
  padding-top: 36rpx;
}

.tips-list,
.guide-list {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  margin-top: 24rpx;
}

.tip-item {
  display: flex;
  gap: 24rpx;
  padding: 26rpx;
  align-items: flex-start;
}

.tip-icon {
  width: 76rpx;
  height: 76rpx;
  border-radius: 24rpx;
  background: rgba(196, 69, 54, 0.12);
  color: $theme-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.tip-content,
.guide-body {
  display: flex;
  flex-direction: column;
}

.tip-title,
.guide-title {
  font-size: 30rpx;
  font-weight: 600;
}

.tip-desc,
.guide-desc,
.guide-time {
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.6;
}

.section-block {
  margin-top: 40rpx;
}

.guide-card {
  overflow: hidden;
}

.guide-image-wrap {
  position: relative;
  height: 300rpx;
}

.guide-tag {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: $theme-color;
  color: #ffffff;
  font-size: 22rpx;
}

.guide-body {
  padding: 26rpx;
}

.info-panel {
  padding: 32rpx;
  border-radius: 28rpx;
  background: rgba(232, 168, 124, 0.18);
  border: 2rpx solid rgba(232, 168, 124, 0.4);
}

.info-list {
  margin-top: 22rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.info-dot {
  width: 12rpx;
  height: 12rpx;
  margin-top: 12rpx;
  border-radius: 50%;
  background: $theme-color;
  flex-shrink: 0;
}

.info-text {
  font-size: 24rpx;
  line-height: 1.6;
}

.info-label {
  color: $theme-text;
}
</style>
