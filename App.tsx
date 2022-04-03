import React, { Reducer, useReducer, useState } from "react"
import { Image, LayoutChangeEvent, LogBox, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { GestureHandlerRootView, TapGestureHandler } from "react-native-gesture-handler"
import { scrollTo, useAnimatedRef, useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated"
import { ScrollViewItemProps, HeaderProps, ScrollViewSectionProps, SHs, SHAction, SHTypes } from "./src/@types"
import contacts from './src/data/contacts.json'
import { Scrollbar } from "./src/components/scrollbar.component"

const ScrollViewSection = ({ section, ...ViewProps }: ScrollViewSectionProps) => {
  const { title } = section

  return (
    <View {...ViewProps}>
      <Header title={title} />
      {section.data.map((item, i) =>
        <ScrollViewItem key={i} item={item} />
      )}
    </View>
  )
}

const Header = ({ title }: HeaderProps) => (
  <View style={styles.listSectionHeader}>
    <Text style={styles.listSectionHeaderText}>{title}</Text>
  </View>
)

const ScrollViewItem = ({ item }: ScrollViewItemProps) => {
  const { name, photo } = item

  return (
    <View style={styles.listItem}>
      <Image
        style={styles.listItemImage}
        source={{ uri: photo }}
      />
      <Text>{name}</Text>
    </View>
  )
}

const initialState = {
  scrollview: 0,
  scrollbar: 0
}

const App = () => {
  const [list, _] = useState(contacts) // fetch your list from somewhere
  const LIST_LENGTH = list.length

  // Get height of ScrollView section and Scrollbar section
  const [sectionHeights, dispatch] = useReducer<Reducer<SHs, SHAction>>(reducer, initialState)
  console.log(sectionHeights);

  const scrollViewRef = useAnimatedRef()

  const scrollActive = useSharedValue(false)
  const scrollIndex = useSharedValue(0) // number between 0 and (LIST_LENGTH - 1)
  
  useDerivedValue(() => {
    if (scrollActive.value) return
    scrollTo(scrollViewRef, 0, scrollIndex.value * sectionHeights.scrollview, false)
  })

  const handleScroll = (event: any) => {
    'worklet'
    if (!scrollActive.value) return
    const newScrollIndex = Math.floor(event.nativeEvent.contentOffset.y / sectionHeights.scrollview)
    if (LIST_LENGTH > newScrollIndex && newScrollIndex >= 0) {
      scrollIndex.value = withSpring(newScrollIndex)
    }
  }

  const handleLayout = (e: LayoutChangeEvent, type: SHTypes) => {
    // dont set state if its already set (not zero)
    if (sectionHeights[type]) return
    const { height } = e.nativeEvent.layout
    dispatch({ type: type, payload: height })
  }

  function reducer(state: any, action: any) {
    switch (action.type) {
      case 'scrollview':
        return {
          ...state,
          scrollview: action.payload
        }
      case 'scrollbar':
        return {
          ...state,
          scrollbar: action.payload / LIST_LENGTH
        }
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={[styles.container, styles.flexRow]}>
        <TapGestureHandler onBegan={() => scrollActive.value = true}>
          <ScrollView
            // @ts-ignore
            ref={scrollViewRef}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={30}
            onScroll={handleScroll}
          >
            {list.map((section, i) => (
              <ScrollViewSection
                key={i}
                section={section}
                onLayout={(e) => handleLayout(e, 'scrollview')}
              />
            ))}
          </ScrollView>
        </TapGestureHandler>
        <View style={styles.justifyCenter}>
          <Scrollbar
            list={list}
            scrollActive={scrollActive}
            scrollIndex={scrollIndex}
            sectionHeights={sectionHeights}
            onLayout={(e) => handleLayout(e, 'scrollbar')} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  listItemImage: {
    height: 40,
    width: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  listSectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  listSectionHeaderText: {
    fontSize: 30,
    fontWeight: '900',
  },
})

export default App

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
])

LogBox.ignoreLogs([
  "[reanimated.measure] method cannot be used for web or Chrome Debugger",
])