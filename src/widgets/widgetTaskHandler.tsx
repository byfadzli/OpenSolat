import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OpenSolatWidget, OpenSolatWidgetData } from './OpenSolatWidget';
import {
  WIDGET_DATA_STORAGE_KEY,
  getFallbackWidgetData,
  getSavedWidgetStyle,
} from './widgetDataHelper';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, renderWidget } = props;

  if (widgetAction === 'WIDGET_DELETED') {
    return;
  }

  let widgetData: OpenSolatWidgetData;
  try {
    const raw = await AsyncStorage.getItem(WIDGET_DATA_STORAGE_KEY);
    const style = await getSavedWidgetStyle();

    if (raw) {
      widgetData = JSON.parse(raw);
      widgetData.style = style;
    } else {
      widgetData = getFallbackWidgetData();
      widgetData.style = style;
    }
  } catch (e) {
    widgetData = getFallbackWidgetData();
  }

  renderWidget(<OpenSolatWidget data={widgetData} />);
}
