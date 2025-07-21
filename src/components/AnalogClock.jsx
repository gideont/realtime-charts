import React, { useRef, useEffect } from "react";

function AnalogClock({ size = 180, timeZone = undefined }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    function drawClock() {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set up time for specific timeZone
      const now = timeZone
        ? new Date(new Date().toLocaleString("en-US", { timeZone }))
        : new Date();

      const width = size;
      const height = size;
      const radius = size / 2;

      ctx.clearRect(0, 0, width, height);

      // Face with thin rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 3, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.lineWidth = size * 0.018; // thinner rim
      ctx.strokeStyle = "#d6d6d6";
      ctx.stroke();
      ctx.restore();

      // Hour ticks
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.78);
        ctx.lineTo(0, -radius * 0.90);
        ctx.lineWidth = size * 0.018;
        ctx.strokeStyle = "#222";
        ctx.stroke();
        ctx.restore();
      }

      // Minute ticks
      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue;
        const angle = (i * Math.PI) / 30;
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.84);
        ctx.lineTo(0, -radius * 0.90);
        ctx.lineWidth = size * 0.008;
        ctx.strokeStyle = "#aaa";
        ctx.stroke();
        ctx.restore();
      }

      // Numbers (smaller)
      ctx.save();
      ctx.font = `${size * 0.11}px Arial`;
      ctx.fillStyle = "#222";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (let num = 1; num <= 12; num++) {
        const ang = ((num - 3) * Math.PI) / 6;
        ctx.fillText(
          num,
          radius + Math.cos(ang) * radius * 0.64,
          radius + Math.sin(ang) * radius * 0.64
        );
      }
      ctx.restore();

      // Hour, minute, second hands
      let hour = now.getHours() % 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();

      // Hour hand
      let hourAngle = ((hour + minute / 60) * Math.PI) / 6;
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(hourAngle);
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, -radius * 0.46);
      ctx.lineWidth = size * 0.045;
      ctx.strokeStyle = "#222";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // Minute hand
      const minAngle = ((minute + second / 60) * Math.PI) / 30;
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(minAngle);
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(0, -radius * 0.68);
      ctx.lineWidth = size * 0.025;
      ctx.strokeStyle = "#222";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // Second hand
      const secAngle = (second * Math.PI) / 30;
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(secAngle);
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(0, -radius * 0.77);
      ctx.lineWidth = size * 0.01;
      ctx.strokeStyle = "#d31c1c";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // Center cap
      ctx.save();
      ctx.beginPath();
      ctx.arc(radius, radius, size * 0.025, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function animate() {
      drawClock();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, timeZone]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        display: "block",
        background: "#fff",
        borderRadius: "50%",
        margin: "0 auto",
        maxWidth: "100%",
        boxShadow: "0 1px 12px #bbb3",
      }}
    />
  );
}

export default AnalogClock;

