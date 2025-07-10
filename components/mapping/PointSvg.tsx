import { LocationPoint } from "@/types/context";
import { SIMILIE_BLUE } from "@libs";
import { RiskIndicatorMapDirectValue, RiskIndicatorMapValue } from "@types";
import React, { useEffect } from "react";
import { BellAlertIcon, MapIcon, SunIcon } from "react-native-heroicons/solid";
import Svg, { Circle, G, Path } from "react-native-svg";

const PointSvg: React.FC<{ location?: LocationPoint; color?: string }> = ({
  location,
  color = "#ffffff",
}) => {
  const [iconColor, setIconColor] = React.useState("#555");
  const [hasAlert, setHasAlert] = React.useState(false);
  //   const [maxAlert, setMaxAlert] = React.useState<{
  //     severity: number;
  //     color: string;
  //   }>();
  const applyAlerts = () => {
    console.log("Applying alerts for location:", location);
    if (!location || !location.alerts || location.alerts.length === 0) {
      return setIconColor(SIMILIE_BLUE); // Gold color for sun icon;
    }
    let maxAlert = -1;
    let maxColor = "#555";
    for (const alert of location.alerts) {
      console.log("Alert severity:", alert.severity);
      const severity = RiskIndicatorMapDirectValue[alert.severity];
      if (severity > maxAlert) {
        maxAlert = severity;
        maxColor = alert.color || "#555";
      }
    }
    // setMaxAlert({ severity: maxAlert, color: maxColor });
    setIconColor(maxColor); // Gold color for sun icon
    if (maxAlert >= RiskIndicatorMapValue.moderate) {
      setHasAlert(true);
    }
  };
  useEffect(() => {
    if (location) {
      applyAlerts();
    } else {
      setIconColor("#555"); // Default color
    }
  }, [location]);

  return (
    <>
      <Svg width={65} height={65} viewBox="0 0 91 91">
        <G stroke={"#DDD"} fill={color}>
          <Path
            d="M42.9,52.2V91h5.3V52.2C60.9,50.9,70.8,40,70.8,27.1c0-13.9-11.4-25.3-25.3-25.3S20.2,13.2,20.2,27.1
         C20.2,40,30.2,50.8,42.9,52.2z"
          />
        </G>
        <Circle fill="#FFFFFF" stroke={"#DDD"} cx="45.8" cy="26.8" r="21" />

        <G
          // Move the icon to the center of the circle (adjust translateX/Y as needed)
          transform="translate(19 6)"
          // Scale down your 24×24 icon so it fits inside the 42px diameter circle
          scale={1.5}
        >
          {!location && <MapIcon width={24} height={24} color={iconColor} />}
          {location && !hasAlert && (
            <SunIcon width={24} height={24} color={iconColor} />
          )}
          {location && hasAlert && (
            <BellAlertIcon width={24} height={24} color={iconColor} />
          )}
        </G>
      </Svg>
    </>
  );
};

export default PointSvg;
