import { useCallback, useEffect, useState } from "react";
import "./control-input.css";

type ControlInputProps = {
  label: string;
  unit: string;
  value: number;
  min?: number;
  max?: number;
  decimals?: number;
  onChange: (value: number) => void;
  onPreview: (value: number) => void;
};

const GLUED_UNITS = ["°", "'", "′"];

export const ControlInput: React.FC<ControlInputProps> = (props) => {
  const randomId =
    "control-field-" + props.label.toLowerCase().replace(" ", "-");

  const [liveValue, setLiveValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const stringValue = props.value.toFixed(props.decimals ?? 0);
  const isOutOfRange =
    (props.min != null && parseFloat(liveValue) < props.min) ||
    (props.max != null && parseFloat(liveValue) > props.max);

  const onFocus = useCallback(() => {
    setLiveValue(stringValue);
    setIsFocused(true);
  }, [stringValue]);

  const onBlur = useCallback(() => {
    if (isOutOfRange) return;

    setIsFocused(false);
    props.onChange(parseFloat(liveValue));
    props.onPreview(parseFloat(liveValue));
  }, [isOutOfRange, liveValue, props.onChange, props.onPreview]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLiveValue(e.target.value);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    setStartX(e.clientX);
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const sensitivity = props.decimals && props.decimals > 1 ? 0.1 : 1; // Adjust sensitivity for drag speed
      if (dx !== 0) {
        const increment = dx > 0 ? sensitivity : -sensitivity;
        const newValue = parseFloat(liveValue) + increment;
        setLiveValue(newValue.toFixed(props.decimals ?? 0));
        setStartX(e.clientX);

        if (!isOutOfRange) props.onPreview?.(newValue);
      }
    },
    [props.onPreview, isOutOfRange, isDragging, startX, liveValue],
  );

  const onMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }

    if (isDragging && !isOutOfRange) {
      props.onChange(parseFloat(liveValue));
      props.onPreview(parseFloat(liveValue));
    }
  }, [isDragging, isOutOfRange, liveValue, props.onChange]);

  // Attach global event listeners when dragging starts and remove them when it stops
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const onKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    },
    [liveValue, props.onChange],
  );

  const unit = (GLUED_UNITS.includes(props.unit) ? "" : " ") + props.unit;
  const value = isFocused ? liveValue : stringValue + unit;

  return (
    <div className="control-input">
      <label htmlFor={randomId}>{props.label}</label>
      <input
        id={randomId}
        type="text"
        value={value}
        data-out-of-range={isOutOfRange}
        onKeyUp={onKeyPress}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseDown={onMouseDown}
      />
    </div>
  );
};
