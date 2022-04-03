import { ViewProps } from "react-native"
import { SharedValue } from "react-native-reanimated"

export type Item = {
  name: string
  photo: string
}

export type Section = {
  title: string
  data: Item[]
}

// SH = SectionHeight

export type SHs = {
  scrollview: number
  scrollbar: number
}

export type SHTypes = 'scrollview' | 'scrollbar'

export type SHAction = {
  type: SHTypes, payload: number
}

export interface ScrollbarProps extends ViewProps {
  list: Section[]
  scrollActive: SharedValue<boolean>
  scrollIndex: SharedValue<number>
  sectionHeights: SHs
}

export interface ScrollbarItemProps {
  section: Section
  index: number
  scrollIndex: SharedValue<number>
}

export interface ScrollbarIndicatorProps {
  active: SharedValue<boolean>
  scrollIndex: SharedValue<number>
  sectionHeights: SHs
}

export interface ScrollViewSectionProps extends ViewProps {
  section: Section
}

export interface HeaderProps {
  title: string
}

export interface ScrollViewItemProps {
  item: Item
}
