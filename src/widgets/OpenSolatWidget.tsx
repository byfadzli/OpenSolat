import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export type WidgetStyleType = 'classic_capsule' | 'bold_banner' | 'mysolat_green';

export interface WidgetPrayerItem {
  name: string;
  time: string;
  isNext: boolean;
}

export interface OpenSolatWidgetData {
  style?: WidgetStyleType;
  zoneCode: string;
  zoneLocation: string;
  hijriDate: string;
  gregorianDate: string;
  nextPrayerName: string;
  nextPrayerTime: string;
  countdown: string;
  prayers: WidgetPrayerItem[];
  imsakTime?: string;
  lastUpdated: string;
}

interface OpenSolatWidgetProps {
  data: OpenSolatWidgetData;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * STYLE 1: MUSLIM'S PRAYER TIMES (Sleek Dark Minimalist & Capsule)
 * Inspired by the top widget in the user reference image
 * ═══════════════════════════════════════════════════════════════════
 */
const renderClassicCapsuleWidget = (data: OpenSolatWidgetData) => {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 12,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#3F3F46',
      }}
    >
      {/* Top Header: Centered Hijri Date & Gregorian Date */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderBottomColor: '#27272A',
        }}
      >
        <TextWidget
          text={`${data.hijriDate || 'Takwim Hijri'}   •   ${data.gregorianDate || ''}`}
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#D4D4D8',
          }}
          maxLines={1}
          truncate="END"
        />
      </FlexWidget>

      {/* Prayer Schedule Row with Capsule for Active/Next Prayer */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 4,
        }}
      >
        {data.prayers.map((p, idx) => {
          const isNext = p.isNext;
          return (
            <FlexWidget
              key={`prayer-${idx}`}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 5,
                paddingHorizontal: isNext ? 8 : 4,
                borderRadius: isNext ? 14 : 0,
                ...(isNext
                  ? {
                      backgroundColor: '#09090B',
                      borderWidth: 1,
                      borderColor: '#52525B',
                    }
                  : {}),
              }}
            >
              <TextWidget
                text={p.name}
                style={{
                  fontSize: 10,
                  fontWeight: isNext ? 'bold' : 'normal',
                  color: isNext ? '#FFFFFF' : '#A1A1AA',
                  marginBottom: 2,
                }}
              />
              <TextWidget
                text={p.time}
                style={{
                  fontSize: 11,
                  fontWeight: 'bold',
                  color: isNext ? '#FFFFFF' : '#E4E4E7',
                }}
              />
            </FlexWidget>
          );
        })}
      </FlexWidget>

      {/* Bottom Sub-Bar: Location & Title */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 3,
        }}
      >
        <TextWidget
          text={`📍 ${data.zoneLocation || 'Malaysia'}`}
          style={{
            fontSize: 10,
            color: '#71717A',
          }}
          maxLines={1}
          truncate="END"
        />
        <TextWidget
          text="OpenSolat"
          style={{
            fontSize: 10,
            fontWeight: '600',
            color: '#A1A1AA',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * STYLE 2: MALAYSIA PRAYER TIMES (Dual-Tone Bold Amber Banner)
 * Inspired by the middle widget in the user reference image
 * ═══════════════════════════════════════════════════════════════════
 */
const renderBoldBannerWidget = (data: OpenSolatWidgetData) => {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        backgroundColor: '#18181B',
        borderRadius: 18,
        overflow: 'hidden',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Half: Vibrant Amber / Orange Banner */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: '#D97706',
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Big Active Prayer Time & Name */}
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextWidget
            text={data.nextPrayerTime || '--:--'}
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginRight: 6,
            }}
          />
          <TextWidget
            text={(data.nextPrayerName || 'SOLAT').toUpperCase()}
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#FFFFFF',
            }}
          />
        </FlexWidget>

        {/* Right: Hijri Date & Location */}
        <FlexWidget
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text={(data.hijriDate || 'TAK WIM HIJRI').toUpperCase()}
            style={{
              fontSize: 9,
              fontWeight: 'bold',
              color: '#FEF3C7',
            }}
            maxLines={1}
            truncate="END"
          />
          <TextWidget
            text={(data.zoneLocation || 'MALAYSIA').toUpperCase()}
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginTop: 1,
            }}
            maxLines={1}
            truncate="END"
          />
        </FlexWidget>
      </FlexWidget>

      {/* Bottom Half: Dark Timetable with Active Highlight in Amber */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: '#18181B',
          paddingHorizontal: 10,
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {data.prayers.map((p, idx) => {
          const isNext = p.isNext;
          const highlightColor = isNext ? '#F59E0B' : '#E4E4E7';
          const nameColor = isNext ? '#F59E0B' : '#A1A1AA';
          return (
            <FlexWidget
              key={`banner-prayer-${idx}`}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 2,
              }}
            >
              <TextWidget
                text={p.name.toUpperCase()}
                style={{
                  fontSize: 9,
                  fontWeight: isNext ? 'bold' : 'normal',
                  color: nameColor,
                  marginBottom: 2,
                }}
              />
              <TextWidget
                text={p.time}
                style={{
                  fontSize: 11,
                  fontWeight: isNext ? 'bold' : '600',
                  color: highlightColor,
                }}
              />
            </FlexWidget>
          );
        })}
      </FlexWidget>
    </FlexWidget>
  );
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * STYLE 3: MYSOLAT (Islamic Olive Green Header & Full Timetable)
 * Inspired by the bottom widget in the user reference image
 * ═══════════════════════════════════════════════════════════════════
 */
const renderMySolatGreenWidget = (data: OpenSolatWidgetData) => {
  // Full timetable including Imsak if available
  const allColumns = [
    { name: 'imsak', time: data.imsakTime || '05:38', isNext: false },
    ...data.prayers.map(p => ({
      name: p.name.toLowerCase(),
      time: p.time,
      isNext: p.isNext,
    })),
  ];

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        backgroundColor: '#121820',
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Half: Islamic Olive/Forest Green Banner with Mosque Header */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: '#65A30D', // Vibrant Olive Islamic Green
          paddingHorizontal: 12,
          paddingVertical: 7,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: Location & Hijri Date */}
        <FlexWidget
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <FlexWidget
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TextWidget
              text="🕌"
              style={{
                fontSize: 11,
                marginRight: 4,
              }}
            />
            <TextWidget
              text={data.zoneLocation || 'Malaysia'}
              style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}
              maxLines={1}
              truncate="END"
            />
          </FlexWidget>
          <TextWidget
            text={data.hijriDate || 'Takwim Hijri'}
            style={{
              fontSize: 9,
              color: '#ECFCCB',
              marginTop: 1,
            }}
          />
        </FlexWidget>

        {/* Right: Minaret / App Badge */}
        <FlexWidget
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text="🔔 OpenSolat"
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: '#FFFFFF',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Bottom Half: Full 7-slot Schedule with Active Highlight in Bright Green */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: '#121820',
          paddingHorizontal: 8,
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {allColumns.map((p, idx) => {
          const isNext = p.isNext;
          const activeColor = isNext ? '#84CC16' : '#F1F5F9';
          const labelColor = isNext ? '#84CC16' : '#94A3B8';
          return (
            <FlexWidget
              key={`mysolat-${idx}`}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextWidget
                text={p.time}
                style={{
                  fontSize: 11,
                  fontWeight: isNext ? 'bold' : 'normal',
                  color: activeColor,
                  marginBottom: 2,
                }}
              />
              <TextWidget
                text={p.name}
                style={{
                  fontSize: 8,
                  fontWeight: isNext ? 'bold' : 'normal',
                  color: labelColor,
                }}
              />
            </FlexWidget>
          );
        })}
      </FlexWidget>
    </FlexWidget>
  );
};

export const OpenSolatWidget: React.FC<OpenSolatWidgetProps> = ({ data }) => {
  const style = data.style || 'classic_capsule';

  if (style === 'bold_banner') {
    return renderBoldBannerWidget(data);
  }

  if (style === 'mysolat_green') {
    return renderMySolatGreenWidget(data);
  }

  return renderClassicCapsuleWidget(data);
};
