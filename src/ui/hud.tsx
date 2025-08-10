import { useCallback } from 'react';

interface HudProps {
  angleDeg: number
  power: number
  windAx: number
  onAngleChange: (deg: number) => void
  onPowerChange: (p: number) => void
  onWindChange: (ax: number) => void
  activeTankId?: string
}

export const Hud = ({ angleDeg, power, windAx, onAngleChange, onPowerChange, onWindChange, activeTankId }: HudProps) => {
  const handleAngle = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => onAngleChange(Number(e.target.value)),
    [onAngleChange],
  );
  const handlePower = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => onPowerChange(Number(e.target.value)),
    [onPowerChange],
  );
  const handleWind = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => onWindChange(Number(e.target.value)),
    [onWindChange],
  );
  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        top: 12,
        padding: 8,
        background: 'rgba(2,6,23,0.6)',
        color: '#e2e8f0',
        borderRadius: 8,
        fontSize: 12,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ marginBottom: 6 }}>Wind: {windAx.toFixed(1)} px/s²</div>
      {activeTankId ? (
        <div style={{ marginBottom: 6 }}>Active: {activeTankId}</div>
      ) : null}
      <label style={{ display: 'block', marginBottom: 6 }}>
        Angle: {angleDeg}°
        <input
          type="range"
          min={5}
          max={85}
          value={angleDeg}
          onChange={handleAngle}
          style={{ width: 180, marginLeft: 8 }}
        />
      </label>
      <label style={{ display: 'block' }}>
        Power: {power}
        <input
          type="range"
          min={100}
          max={600}
          value={power}
          onChange={handlePower}
          style={{ width: 180, marginLeft: 8 }}
        />
      </label>
      <label style={{ display: 'block', marginTop: 6 }}>
        WindAx:
        <input
          type="range"
          min={-200}
          max={200}
          step={5}
          value={windAx}
          onChange={handleWind}
          style={{ width: 180, marginLeft: 8 }}
        />
      </label>
    </div>
  );
};
