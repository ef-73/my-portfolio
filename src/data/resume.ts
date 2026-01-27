/**
 * RESUME.TS: Single source of truth for all resume content
 * Model: Signal → Structure → Control
 * Every field is authoritative and derived from Ethan's official resume
 */

export interface Metric {
  iou?: number; // 0.86
  ndcg?: number; // 0.83
  accuracy?: string; // "±3 mm"
  ranking?: { position: number; year: number }[]; // [{ position: 6, year: 2023 }, { position: 8, year: 2024 }]
}

export interface Project {
  id: string;
  title: string;
  problemStatement: string; // One-line framing: "Turn..." or "Build..."
  approach: string;
  constraints: string[]; // ["18-channel input", "<1B parameters", "offline compute", etc.]
  metrics: Metric;
  domains: ("Robotics" | "CV" | "ML" | "Systems")[];
  tech: string[];
  status: "completed" | "in-progress"; // Default: "completed"
  links: {
    github?: string;
    paper?: string;
    demo?: string;
    writeup?: string;
  };
  depth: {
    architecture: string[]; // Bullet list only
    tradeoffs: string[]; // Bullet list only
    failureModes: string[]; // Bullet list only
    nextSteps: string[]; // Bullet list only
  };
}

export interface Experience {
  org: string;
  role: string;
  dateRange: string; // "Jun 2024 – Jul 2025"
  bullets: string[];
}

export interface Competition {
  name: string;
  event: string;
  dateRange: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  dateRange: string;
  details: string[];
}

export interface Skill {
  category: "Languages" | "ML" | "Systems";
  items: string[];
}

export interface ResumeData {
  name: string;
  email: string;
  location: string;
  domains: string[];
  heroStatement: string;
  education: Education[];
  experience: Experience[];
  competitions: Competition[];
  featuredProjects: Project[];
  allProjects: Project[];
  skills: Skill[];
}

// ============================================================================
// RESUME CONTENT (AUTHORITATIVE)
// ============================================================================

export const resume: ResumeData = {
  name: "Ethan Fung",
  email: "ethan.f07w@gmail.com",
  location: "Waterloo, ON",
  domains: ["Robotics", "Computer Vision", "Machine Learning"],
  heroStatement:
    "Software Engineering @ Waterloo. I build systems that turn noisy signals into reliable decisions.",

  // ========== EDUCATION ==========
  education: [
    {
      institution: "University of Waterloo",
      degree: "Bachelor of Software Engineering",
      dateRange: "Sep 2025 – Present",
      details: [
        "GPA: 3.9/4.0",
        "$20,000 Scotiabank Software Engineering Entrance Scholarship",
      ],
    },
  ],

  // ========== EXPERIENCE ==========
  experience: [
    {
      org: "Toronto Metropolitan University",
      role: "Robotics Junior Research Assistant",
      dateRange: "Jun 2024 – Jul 2025",
      bullets: [
        "Co-authored peer-reviewed papers comparing analytical vs deep-learning IK pipelines",
        "Presented full-stack 6-DOF manipulation system at IC-MSQUARE 2024",
        "Achieved ±3 mm end-effector accuracy using 5th-order torque trajectory control (MATLAB/Simulink)",
        "Integrated custom actuation hardware with AprilTag + OpenCV for pose estimation",
        "Publications: JPCS 2024 (doi:10.1088/1742-6596/3027/1/012039), IJSES 2024",
      ],
    },
    {
      org: "FIRST Tech Challenge Teams 16417 & 19446",
      role: "Robotics Team Captain",
      dateRange: "Sep 2023 – Jun 2025",
      bullets: [
        "Built Java-based autonomous pipelines with OpenCV perception, odometry, and multithreaded PID",
        "Led 30+ members across programming, mechanical, and outreach teams",
        "World Championship ranks: #6 (2023), #8 (2024) out of 7,000+ teams",
        "3× Provincial Champion, Control Award winner",
      ],
    },
  ],

  // ========== COMPETITIONS ==========
  competitions: [
    {
      name: "International Olympiad in Artificial Intelligence",
      event: "Team Canada Competitor",
      dateRange: "Jul 2025 – Aug 2025",
      bullets: [
        "Highest scorer on Team Canada",
        "Top 50% among 280+ competitors from 40+ countries",
        "Solved time-constrained multimodal ML tasks under offline compute limits",
        "Built end-to-end ML pipelines (preprocessing, modeling, evaluation)",
      ],
    },
  ],

  // ========== FEATURED PROJECTS (in order, these appear on homepage) ==========
  featuredProjects: [
    {
      id: "moosetrax",
      title: "MooseTrax — Biomechanics Evaluation",
      problemStatement:
        "Stabilize noisy pose keypoint data and segment exercise reps in real time.",
      approach:
        "Confidence pruning + temporal filtering for keypoint stability; joint-angle kinematics for rep segmentation; LLM-based feedback gating.",
      constraints: [
        "Noisy keypoint confidence scores",
        "Real-time inference required",
        "Contextual analytics for LLM interpretation",
      ],
      metrics: {},
      domains: ["CV"],
      tech: ["Python", "OpenCV", "NumPy", "LLM Integration"],
      status: "completed",
      links: {
        github: undefined, // TODO
        demo: undefined, // TODO
      },
      depth: {
        architecture: [
          "Confidence-gated keypoint stabilization via exponential moving average",
          "Joint angle computation from filtered keypoints using 3D geometry",
          "Rep boundary detection via kinematic threshold crossing",
          "Confidence-gated analytics: only report metrics above threshold",
        ],
        tradeoffs: [
          "Chose temporal filtering over Kalman to avoid state explosion",
          "Confidence pruning reduces precision but improves robustness",
          "Real-time vs. batch processing trade-off favored streaming",
        ],
        failureModes: [
          "Occlusion of key joints → missing rep detection",
          "Noisy keypoint confidence → false positives in rep count",
          "Threshold tuning sensitive to exercise variation",
        ],
        nextSteps: [
          "Adaptive confidence thresholding based on exercise type",
          "Hierarchical rep segmentation (set → rep → rep phase)",
          "LLM reasoning over temporal segments for form feedback",
        ],
      },
    },

    {
      id: "satellite-rainfall",
      title: "Satellite Rainfall Segmentation (GOES-16)",
      problemStatement:
        "Segment precipitation zones from 18-channel satellite imagery with minimal computational overhead.",
      approach:
        "SE-ResNet encoder + U-Net decoder with spectral re-weighting; precipitation-sensitive IR fusion; domain-consistent augmentations.",
      constraints: [
        "18-channel multichannel input (visible, IR, water vapor)",
        "Domain shift across geographic regions",
        "Inference on edge devices",
      ],
      metrics: {
        iou: 0.86,
      },
      domains: ["ML"],
      tech: ["PyTorch", "TensorFlow", "NumPy", "Satellite Imagery Processing"],
      status: "completed",
      links: {
        github: undefined, // TODO
        paper: undefined, // TODO
        writeup: undefined, // TODO
      },
      depth: {
        architecture: [
          "SE-ResNet encoder: squeeze-and-excitation blocks for channel re-weighting",
          "U-Net decoder with skip connections from encoder",
          "Spectral fusion layer: concatenate IR bands with learned weights",
          "Output: binary precipitation mask + confidence map",
        ],
        tradeoffs: [
          "SE-ResNet over plain ResNet: +2% IoU, +5% params",
          "Spectral re-weighting vs. fixed fusion: adaptive but slower inference",
          "Augmentation intensity vs. domain coverage trade-off",
        ],
        failureModes: [
          "Thin cloud edges → under-segmentation",
          "High-altitude ice clouds misclassified as precipitation",
          "Domain shift on new geographic regions requires fine-tuning",
        ],
        nextSteps: [
          "Multi-task learning: precipitation + cloud type + altitude",
          "Temporal consistency loss across consecutive satellite frames",
          "Physics-informed loss terms (energy balance)",
        ],
      },
    },

    {
      id: "semantic-retrieval",
      title: "Hint-to-Word Semantic Retrieval",
      problemStatement:
        "Retrieve target words from hints using semantic embeddings within strict offline compute constraints.",
      approach:
        "SBERT embeddings + k-NN cosine similarity; alternative retrieval heads; UMAP + KMeans clustering; contrastive fine-tuning.",
      constraints: [
        "Offline constraint: <1B parameters",
        "Real-time inference (sub-100ms)",
        "Limited training data",
      ],
      metrics: {
        ndcg: 0.83,
      },
      domains: ["ML"],
      tech: ["PyTorch", "Transformers", "scikit-learn", "UMAP"],
      status: "completed",
      links: {
        github: undefined, // TODO
      },
      depth: {
        architecture: [
          "SBERT base model: 110M params, frozen backbone",
          "Alternative retrieval heads: MLPs for domain adaptation",
          "Clustering: UMAP + KMeans for hint-to-cluster mapping",
          "Ranking: k-NN cosine similarity within cluster",
        ],
        tradeoffs: [
          "Frozen SBERT vs. fine-tuning: +5% speed, -2% NDCG",
          "Clustering overhead vs. search latency reduction (10x speedup)",
          "Contrastive loss intensity vs. convergence stability",
        ],
        failureModes: [
          "Polysemous hints → ambiguous target candidates",
          "Out-of-vocabulary words → fallback to character n-gram similarity",
          "Clustering artifacts → hint-to-cluster mismatch on edge cases",
        ],
        nextSteps: [
          "Multi-sense embeddings for polysemy handling",
          "Hierarchical retrieval: coarse cluster → fine k-NN",
          "Active learning on misclassified hint-word pairs",
        ],
      },
    },

    {
      id: "badminton-motion",
      title: "Video-Based Motion Analysis for Badminton",
      problemStatement:
        "Track players and shuttle in real-time video, predict shot responses from trajectory.",
      approach:
        "YOLOv8 player/shuttle detection; court homography via Canny + Hough; Kalman filtering for trajectory smoothing; GRU sequence modeling for shot-response prediction.",
      constraints: [
        "Real-time processing (30 FPS)",
        "Robust to scale variation (near/far shuttle)",
        "Court perspective distortion",
      ],
      metrics: {},
      domains: ["CV"],
      tech: ["YOLOv8", "OpenCV", "PyTorch", "Kalman Filter"],
      status: "completed",
      links: {
        github: undefined, // TODO
        demo: undefined, // TODO
      },
      depth: {
        architecture: [
          "YOLOv8n (nano): 3.2M params, 45 FPS on CPU",
          "Court homography: Canny edge detection → Hough line transform → corner extraction",
          "Kalman filter: state = [x, y, vx, vy], measurement = YOLO centroid",
          "GRU: input = (player_pos, shuttle_pos, shuttle_velocity) → output = next_position",
        ],
        tradeoffs: [
          "YOLOv8n vs. YOLOv8m: -8% mAP, +2x throughput",
          "Kalman vs. linear interpolation: +5% trajectory smoothness, +2ms latency",
          "GRU vs. LSTM: fewer params, similar performance",
        ],
        failureModes: [
          "Shuttle blur at high speed → YOLO misdetection",
          "Occlusion (player blocks shuttle) → Kalman prediction failure",
          "Non-standard court markings → homography inaccuracy",
        ],
        nextSteps: [
          "Temporal ensembling: combine YOLOv8 + optical flow",
          "Shot classification: overhead, underhand, net play",
          "Opponent response prediction: multimodal GRU + attention",
        ],
      },
    },

    {
      id: "text-motion-rl",
      title: "Text-to-Motion Reinforcement Learning for 6-DOF Robot",
      problemStatement:
        "Ground language instructions to robot control policies in physics simulation.",
      approach:
        "Physics-based Unity simulator; goal-conditioned RL; language embeddings for state-goal representation; PyTorch policy inference in closed loop.",
      constraints: [
        "Sparse reward signal",
        "Sim-to-real gap",
        "Language ambiguity",
      ],
      metrics: {},
      domains: ["Robotics", "ML", "Systems"],
      tech: ["PyTorch", "Unity", "RL", "Language Embeddings"],
      status: "in-progress",
      links: {
        github: undefined, // TODO
      },
      depth: {
        architecture: [
          "Goal representation: language embedding (BERT) + forward kinematics predicate",
          "RL agent: PPO with value function baseline",
          "Reward: sparse L2 distance to goal + dense orientation alignment",
          "Policy inference: real-time PyTorch on robot control loop (20 Hz)",
        ],
        tradeoffs: [
          "Sparse vs. dense rewards: exploration vs. convergence speed",
          "Simulation realism vs. training speed",
          "Language embedding dimensionality vs. policy capacity",
        ],
        failureModes: [
          "Goal specification ambiguity: 'move right' → multiple solutions",
          "Physics simulation inaccuracy → policy failure on real robot",
          "Unobserved obstacles → collision during deployment",
        ],
        nextSteps: [
          "Sim-to-real transfer: domain randomization, IRL from demonstrations",
          "Multi-goal hierarchical RL: high-level language → low-level actions",
          "Safety constraints: collision avoidance, torque limits",
        ],
      },
    },
  ],

  // ========== ALL PROJECTS (same as featured for now, can expand) ==========
  allProjects: [], // Will be populated by featuredProjects for now; can add more in Phase 2

  // ========== SKILLS ==========
  skills: [
    {
      category: "Languages",
      items: ["Python", "C++", "Java", "MATLAB", "C"],
    },
    {
      category: "ML",
      items: ["PyTorch", "TensorFlow", "Transformers", "RL", "Sequence Models"],
    },
    {
      category: "Systems",
      items: ["ROS2", "Unity", "Simulink", "Linux", "Docker", "Git"],
    },
  ],
};

// Initialize allProjects to featured projects
resume.allProjects = resume.featuredProjects;
