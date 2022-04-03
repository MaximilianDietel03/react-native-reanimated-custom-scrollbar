import React from "react"
import { StyleSheet } from "react-native"
import Animated, { useAnimatedStyle, useDerivedValue, withSpring, withTiming } from "react-native-reanimated"
import { ScrollbarIndicatorProps } from "../@types"

export const ScrollbarIndicator = ({ active, scrollIndex, sectionHeights }: ScrollbarIndicatorProps) => {

  const scale = useDerivedValue(() => {
    return active.value ? 1.8 : 1
  })

  const borderWidth = useDerivedValue(() => {
    return active.value ? 2 : sectionHeights.scrollbar / 2
  })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(scale.value) },
      ],
      borderWidth: withTiming(borderWidth.value)
    }
  })
  
  const animatedTranslateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: scrollIndex.value * sectionHeights.scrollbar }
      ],
    }
  })

  return (
    <Animated.View  style={[styles(sectionHeights.scrollbar).scrollbarControllerView, animatedTranslateStyles]}>
      <Animated.View style={[styles(sectionHeights.scrollbar).scrollbarController, animatedStyles]} />
    </Animated.View>
  )
}

const styles = (scrollbarSectionHeight: number) => StyleSheet.create({
  scrollbarController: {
    width: scrollbarSectionHeight,
    height: scrollbarSectionHeight,
    borderRadius: scrollbarSectionHeight / 2,
    borderWidth: scrollbarSectionHeight / 2,
    borderColor: '#693FC4',
  },
  scrollbarControllerView: {
    position: 'absolute',
    top: 0,
    right: 10
  },
})