import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

// ── Easing helpers ──────────────────────────────────────────────────────────
const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

// ── Animated text that slides up + fades in ─────────────────────────────────
const SlideUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        transform: `translateY(${interpolate(progress, [0, 1], [60, 0])}px)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Floating particle ────────────────────────────────────────────────────────
const Particle: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
}> = ({ x, y, size, color, speed, phase }) => {
  const frame = useCurrentFrame();
  const floatY = Math.sin((frame * speed) / 30 + phase) * 30;
  const floatX = Math.cos((frame * speed * 0.6) / 30 + phase) * 15;
  const opacity = 0.15 + 0.15 * Math.sin((frame * speed * 0.8) / 30 + phase);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + floatY,
        transform: `translateX(${floatX}px)`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        filter: `blur(${size * 0.3}px)`,
      }}
    />
  );
};

// ── Scene 1: HOOK (0–5s = frames 0–149) ────────────────────────────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient shift
  const gradShift = interpolate(frame, [0, 150], [0, 30]);

  // Big number counter animation
  const days = Math.min(
    60,
    Math.floor(interpolate(frame, [40, 120], [0, 60], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOutExpo,
    }))
  );

  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + gradShift}deg, #0a0a1a 0%, #1a0533 40%, #0d1b3e 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Floating particles */}
      {[
        { x: 80, y: 300, size: 80, color: "#7c3aed", speed: 1.2, phase: 0 },
        { x: 900, y: 200, size: 60, color: "#06b6d4", speed: 0.9, phase: 1 },
        { x: 200, y: 1400, size: 100, color: "#8b5cf6", speed: 0.7, phase: 2 },
        { x: 800, y: 1500, size: 70, color: "#3b82f6", speed: 1.1, phase: 3 },
        { x: 500, y: 800, size: 40, color: "#a78bfa", speed: 1.4, phase: 0.5 },
      ].map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Safe zone content: between 15%–85% vertically */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          padding: "0 80px",
        }}
      >
        {/* Eyebrow */}
        <SlideUp delay={0}>
          <div
            style={{
              fontSize: 36,
              color: "#a78bfa",
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            🇳🇬 Nigerian Graduates
          </div>
        </SlideUp>

        {/* Hook question */}
        <SlideUp delay={8}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.1,
              marginBottom: 40,
              textShadow: "0 0 60px rgba(124,58,237,0.5)",
            }}
          >
            What if you could land your{" "}
            <span style={{ color: "#7c3aed" }}>dream job</span> in just…
          </div>
        </SlideUp>

        {/* Big animated number */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `scale(${interpolate(titleScale, [0, 1], [0.5, 1])})`,
          }}
        >
          <div
            style={{
              fontSize: 280,
              fontWeight: 900,
              lineHeight: 1,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(124,58,237,0.8))",
            }}
          >
            {days}
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            <div>DAYS</div>
            <div
              style={{
                fontSize: 32,
                color: "#a78bfa",
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              or less
            </div>
          </div>
        </div>

        {/* Sub-hook */}
        <SlideUp delay={50}>
          <div
            style={{
              fontSize: 44,
              color: "#e2e8f0",
              textAlign: "center",
              lineHeight: 1.4,
              marginTop: 20,
              maxWidth: 800,
            }}
          >
            No connections. No luck. Just{" "}
            <span
              style={{
                color: "#06b6d4",
                fontWeight: 800,
                textDecoration: "underline",
                textDecorationStyle: "wavy",
              }}
            >
              the right system.
            </span>
          </div>
        </SlideUp>
      </div>

      {/* Bottom scroll indicator */}
      <SlideUp delay={80}>
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            fontSize: 32,
            color: "#7c3aed",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ opacity: 0.6 }}>keep watching 👇</div>
        </div>
      </SlideUp>
    </AbsoluteFill>
  );
};

// ── Scene 2: PROBLEM (frames 150–270 = 5s–9s) ───────────────────────────────
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { emoji: "😩", text: "Endless job applications, zero replies" },
    { emoji: "🤷🏾", text: "No one told you HOW to do this" },
    { emoji: "📉", text: "Your CGPA won't save you" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #1c0a2e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.015) 4px, rgba(255,255,255,0.015) 5px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "18%",
          left: 0,
          right: 0,
          padding: "0 80px",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <SlideUp delay={0}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            You just graduated. Now{" "}
            <span style={{ color: "#f87171" }}>what?</span> 🎓
          </div>
        </SlideUp>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            marginTop: 20,
          }}
        >
          {items.map((item, i) => {
            const itemFrame = frame - (i * 18 + 15);
            const s = spring({
              frame: itemFrame,
              fps,
              config: { damping: 14, stiffness: 120, mass: 0.8 },
            });
            const x = interpolate(s, [0, 1], [-200, 0]);
            const opacity = interpolate(itemFrame, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  transform: `translateX(${x}px)`,
                  opacity,
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: 20,
                  padding: "28px 36px",
                }}
              >
                <span style={{ fontSize: 56 }}>{item.emoji}</span>
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: "#fca5a5",
                    lineHeight: 1.3,
                  }}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <SlideUp delay={70}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#fff",
              textAlign: "center",
              marginTop: 20,
              lineHeight: 1.3,
            }}
          >
            The system is broken.
            <br />
            <span style={{ color: "#7c3aed" }}>But you can hack it.</span>
          </div>
        </SlideUp>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: SOLUTION (frames 270–390 = 9s–13s) ─────────────────────────────
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: "🗺️", title: "Job Search Roadmap", sub: "Step-by-step, no guessing" },
    { icon: "💼", title: "CV & LinkedIn Mastery", sub: "Get seen by recruiters" },
    { icon: "🎯", title: "Interview Cheat Codes", sub: "Say exactly the right thing" },
    { icon: "🚀", title: "60-Day Launch Plan", sub: "Land the job. Fast." },
  ];

  // Rotating glow ring
  const rotate = interpolate(frame, [0, 120], [0, 360], {
    extrapolateRight: "wrap",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0a0a1a 0%, #0d1b3e 60%, #1a0533 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Rotating ring glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          borderRadius: "50%",
          border: "2px solid transparent",
          backgroundImage:
            "linear-gradient(#0a0a1a, #0a0a1a), conic-gradient(from 0deg, #7c3aed, #06b6d4, #7c3aed)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          transform: `rotate(${rotate}deg)`,
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "13%",
          left: 0,
          right: 0,
          padding: "0 70px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <SlideUp delay={0}>
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              borderRadius: 50,
              padding: "14px 48px",
              fontSize: 32,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Introducing
          </div>
        </SlideUp>

        <SlideUp delay={10}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1,
              background: "linear-gradient(135deg, #fff 30%, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(167,139,250,0.6))",
            }}
          >
            The Career OS
          </div>
        </SlideUp>

        <SlideUp delay={20}>
          <div
            style={{
              fontSize: 38,
              color: "#94a3b8",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 820,
            }}
          >
            The complete operating system for{" "}
            <span style={{ color: "#a78bfa", fontWeight: 700 }}>
              fresh Nigerian graduates
            </span>{" "}
            to land jobs in 60 days
          </div>
        </SlideUp>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            width: "100%",
            marginTop: 10,
          }}
        >
          {features.map((f, i) => {
            const itemFrame = frame - (i * 15 + 30);
            const s = spring({
              frame: itemFrame,
              fps,
              config: { damping: 14, stiffness: 130 },
            });
            const scale = interpolate(s, [0, 1], [0.7, 1]);
            const opacity = interpolate(itemFrame, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  borderRadius: 24,
                  padding: "32px 28px",
                  transform: `scale(${scale})`,
                  opacity,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 52 }}>{f.icon}</div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#e2e8f0",
                    lineHeight: 1.2,
                  }}
                >
                  {f.title}
                </div>
                <div style={{ fontSize: 26, color: "#94a3b8" }}>{f.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: CTA (frames 390–450 = 13s–15s) ─────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8, stiffness: 80, mass: 0.6 },
  });
  const btnScale = interpolate(pulse, [0, 1], [0.8, 1]);

  // Looping glow
  const glowSize = 40 + 20 * Math.sin((frame / 30) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #1a0533 0%, #0a0a1a 50%, #0d1b3e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Burst lines from center */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const len = interpolate(frame, [0, 60], [0, 400], {
          extrapolateRight: "clamp",
          easing: easeOutExpo,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: len,
              height: 2,
              background:
                "linear-gradient(90deg, rgba(124,58,237,0.6), transparent)",
              transformOrigin: "left center",
              transform: `rotate(${angle}deg)`,
              opacity: 0.4,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          top: "18%",
          left: 0,
          right: 0,
          padding: "0 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <SlideUp delay={0}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 900,
              textAlign: "center",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Stop waiting for luck.
          </div>
        </SlideUp>

        <SlideUp delay={12}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get the Career OS
            </span>{" "}
            <span style={{ color: "#fff" }}>today.</span>
          </div>
        </SlideUp>

        {/* CTA button */}
        <div
          style={{
            marginTop: 20,
            transform: `scale(${btnScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              borderRadius: 80,
              padding: "36px 90px",
              fontSize: 52,
              fontWeight: 900,
              color: "#fff",
              textAlign: "center",
              boxShadow: `0 0 ${glowSize}px rgba(124,58,237,0.8), 0 0 ${glowSize * 2}px rgba(124,58,237,0.3)`,
              letterSpacing: 1,
            }}
          >
            🔗 Link in Bio
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#a78bfa",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Enroll now • 60-Day Guarantee
          </div>
        </div>

        <SlideUp delay={25}>
          <div
            style={{
              display: "flex",
              gap: 30,
              marginTop: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { label: "✅ Land job in 60 days" },
              { label: "✅ Fresh grads only" },
              { label: "✅ Nigerian market" },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.4)",
                  borderRadius: 50,
                  padding: "14px 30px",
                  fontSize: 30,
                  color: "#c4b5fd",
                  fontWeight: 600,
                }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </SlideUp>
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ─────────────────────────────────────────────────────────
export const CareerOS: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}>
      <Sequence from={0} durationInFrames={150}>
        <HookScene />
      </Sequence>
      <Sequence from={150} durationInFrames={120}>
        <ProblemScene />
      </Sequence>
      <Sequence from={270} durationInFrames={120}>
        <SolutionScene />
      </Sequence>
      <Sequence from={390} durationInFrames={60}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
