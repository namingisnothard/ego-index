export type Kind = 'Dataset' | 'Pipeline' | 'General model' | 'Policy' | 'Organization' | 'Person';
export type Signal = 'RGB' | '3D / pose' | 'Contact' | 'Gaze' | 'IMU' | 'Ego–exo' | 'Language' | 'Robot action';
export type Task = 'Manipulation' | 'Navigation' | 'Locomotion' | 'Teleoperation' | 'Perception' | 'Human motion' | 'Assistance' | 'Memory / QA' | 'Generation / world model' | 'Agentic RSI' | 'General';
export type SceneGroup = 'Indoor' | 'Outdoor' | 'Tabletop / workbench' | 'Room-scale / building' | 'Industrial / warehouse' | 'Kitchen / household' | 'Office / social' | 'Urban / road' | 'Sports / skilled activity' | 'Synthetic / simulation' | 'Mixed / in-the-wild';
export type CameraGroup = 'Calibration / intrinsics' | 'Model family only';
export type CameraView = 'Monocular' | 'Stereo / binocular' | 'Multi-camera / multiview' | 'Mixed / variable';
export type CaptureDevice = 'Meta Aria' | 'Apple Vision Pro' | 'GoPro' | 'Insta360' | 'iPhone / smartphone' | 'Intel RealSense' | 'Azure Kinect' | 'ZED' | 'HoloLens' | 'VR / Quest headset' | 'Other named capture rig';
export type RobotInterface = 'Parallel-jaw gripper' | 'Dexterous hand' | 'Single-arm / single-hand' | 'Bimanual' | 'Humanoid / whole-body';
export type Capability = 'Reconstruction / geometry' | 'Rendering / novel view' | 'Understanding / recognition' | 'Tracking / localization' | 'Generation / world model' | 'Simulation' | 'Retargeting / embodiment transfer' | 'Policy learning / control' | 'Data capture / annotation';
export type RenderMethod = '3D engine / simulator' | 'Digital-twin rerender' | 'Video diffusion / world model' | 'View translation / neural rendering' | 'Embodiment compositing';
export type DataProvenance = 'Real capture' | 'Hybrid real + rerender' | 'Synthetic simulation' | 'Generated video';
export type ReferenceTag = 'Robot reference' | 'Shared component reference';
export type GeometryLayer = 'Body reconstruction' | 'Hand reconstruction' | 'Object reconstruction' | 'Human–object interaction (HOI)' | 'Scene / environment reconstruction' | 'Physics / dynamics';
export type SystemLayer = 'Perception / state estimation' | 'Simulation / rendering' | 'Physical / embodiment' | 'Planning / control' | 'Data / runtime' | 'RL / training infrastructure' | 'World model / synthetic data';
export type LibraryCategory = 'Method / paper' | 'Tool / platform';
export type AgenticWorkflow = 'Propose / design' | 'Execute / collect' | 'Evaluate / verify' | 'Update / consolidate' | 'Deploy / monitor';
export type AgenticModule = 'Agent / policy' | 'Skill / code library' | 'Environment / sandbox' | 'Evaluator / reward' | 'Optimizer / search' | 'Data / replay';
export type AgenticLayer = 'Improvement loop' | 'Harness / orchestration' | 'Memory / provenance' | 'World model / simulator' | 'Safety / rollback' | 'Benchmark / evaluation';
export type FeedbackSignal = 'Visual / render discrepancy' | 'Task success / verifier' | 'Dense progress / reward' | 'Human correction / preference' | 'Environment / physics state' | 'Safety / constraint';
export type Company = string;
export type DataFormat = 'MP4 / video files' | 'HDF5' | 'MCAP' | 'LeRobot v3' | 'RLDS / TFDS' | 'Parquet' | 'WebDataset / TAR' | 'JSON / JSONL' | 'ROS bag';
export type SharedComponent = 'Retargeting' | 'Inverse kinematics (IK)' | 'MANO' | 'SMPL / SMPL-X' | 'HaWoR' | 'WiLoR' | 'VGGT' | 'MoGe' | 'SLAM' | 'DINOv2' | 'DINOv3' | 'SAM 2' | 'SAM 3' | 'Depth Anything 2' | 'Depth Anything 3' | 'FoundationPose' | 'SpatialTracker' | 'cuRobo';
export type ComponentFamily = 'DINO' | 'SAM' | 'Depth Anything' | 'Retargeting / IK' | 'Human body / hand' | 'Geometry / tracking' | 'Robot planning';
export type InputGroup = 'RGB / video' | 'Depth / RGB-D' | 'Multiview' | 'Language' | 'Audio' | 'Gaze' | 'IMU' | 'Hand / body pose' | 'Robot state / action' | 'Tactile / contact' | 'Human demonstration' | 'Synthetic / simulation' | 'Other input';
export type OutputGroup = 'Dataset / labels' | 'Hand / body motion' | '3D geometry / map' | 'Camera / trajectory' | 'Language / QA' | 'Robot actions / demos' | 'Policy / control' | 'Generated media' | 'Perception / tracking' | 'Benchmark / evaluation' | 'Other output';
export type BenchmarkId = 'Ego4D' | 'Ego-Exo4D' | 'EPIC-KITCHENS' | 'EgoSchema' | 'HOT3D' | 'HOI4D' | 'Assembly101' | 'FreiHAND' | 'HO3D' | 'DexYCB' | 'DTU' | 'ETH3D' | 'ScanNet' | 'LIBERO' | 'CALVIN' | 'RLBench' | 'Meta-World' | 'ManiSkill' | 'RoboCasa' | 'BEHAVIOR';

export type BenchmarkSpec = {
  id: BenchmarkId;
  scope: string;
  metrics: string;
  status: 'Hosted board' | 'Challenge / board' | 'Public protocol';
  url: string;
};

export type ChallengeSpec = {
  name: string;
  host: string;
  window: string;
  task: string;
  metrics: string;
  access: string;
  url: string;
};

export type CreatorCaptureSpec = {
  name: string;
  source: string;
  devices: string;
  scope: string;
  evidence: string;
  url: string;
};

export type EvaluationSummary = {
  benchmark: string;
  stage: 'dataset scale' | 'reconstruction' | 'tracking' | 'retargeting' | 'downstream policy' | 'end-to-end';
  track: string;
  metrics: string;
  protocol: 'Hosted / verified board' | 'Public protocol' | 'Publisher-reported custom';
  comparabilityKey: string;
};

export type SequenceDuration = {
  unit: 'video' | 'clip' | 'episode' | 'trajectory' | 'segment' | 'recording' | 'take' | 'participant week' | 'recording session';
  average?: string;
  distribution?: string;
  basis: 'Reported' | 'Derived from reported total / count';
};

export type LibraryEntry = {
  id: string;
  name: string;
  url: string;
  collection: string;
  collectionTitle: string;
  venue: string;
  kinds: Kind[];
  signals: Signal[];
  tasks: Task[];
  scenes: SceneGroup[];
  sceneCoverage: string;
  sequenceDuration: SequenceDuration | null;
  camera: string;
  cameraGroup: CameraGroup | null;
  cameraView: CameraView | null;
  captureDevices: CaptureDevice[];
  robotInterfaces: RobotInterface[];
  companies: Company[];
  dataFormats: DataFormat[];
  capabilities: Capability[];
  dataProvenance: DataProvenance[];
  referenceTags: ReferenceTag[];
  renderMethods: RenderMethod[];
  geometryLayers: GeometryLayer[];
  systemLayers: SystemLayer[];
  libraryCategory: LibraryCategory;
  agenticWorkflows: AgenticWorkflow[];
  agenticModules: AgenticModule[];
  agenticLayers: AgenticLayer[];
  feedbackSignals: FeedbackSignal[];
  agenticDesign: string;
  computeCost: string;
  limitations: string;
  components: SharedComponent[];
  componentFamilies: ComponentFamily[];
  inputGroups: InputGroup[];
  outputGroups: OutputGroup[];
  benchmarks: BenchmarkId[];
  comparisonMetrics: string[];
  evaluations: EvaluationSummary[];
  input: string;
  output: string;
  release: string;
  access: string;
  accessGroup: 'Open' | 'Gated / request' | 'Announced' | 'Paper / code' | 'Preview / claim';
  scale: string;
  featured: boolean;
  impact: {
    institutions?: Array<{name: string}>;
    huggingFace?: Array<{repo: string; url: string; type: string}>;
    [key: string]: unknown;
  } | null;
  snapshot: Record<string, unknown> | null;
};

export type Collection = {
  id: string;
  title: string;
  updated: string;
  entries: LibraryEntry[];
};

import catalogData from './catalog.json';

function clean(value = '') {
  return value.replace(/<br\s*\/?>/gi, ' · ').replace(/[`*]/g, '').replace(/\\\|/g, '|').replace(/\s*\/\s*/g, '/').trim();
}

function parseLink(value = '') {
  const match = value.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  return {
    name: clean(match?.[1] || value.replace(/^★\s*/, '')),
    url: match?.[2] || '#',
    featured: /^\s*★/.test(value),
  };
}

function inferKinds(role: string, company: boolean, person: boolean, context: string): Kind[] {
  if (person) return ['Person'];
  if (company) return ['Organization'];
  const result: Kind[] = [];
  const tokens = role.toUpperCase().split(/[^A-Z]+/);
  if (tokens.includes('D') || /dataset|benchmark/i.test(role)) result.push('Dataset');
  if (tokens.includes('P') || /pipeline|system|toolkit|platform/i.test(role)) result.push('Pipeline');
  if (tokens.includes('M') || /model|method/i.test(role)) {
    const actionProducing = /\bpolicy\b|vision[-– ]language[-– ]action|\bvla\b|robot actions?|joint commands?|action (?:trajectory|trajectories|chunk|head)|imitation|behavior cloning|robot transfer|robot-specific fine[- ]?tun|zero-shot deployment/i.test(context);
    result.push(actionProducing ? 'Policy' : 'General model');
  }
  return result.length ? result : ['General model'];
}

function inferSignals(value: string): Signal[] {
  const tests: Array<[Signal, RegExp]> = [
    ['RGB', /rgb|video|image|camera|visual|frame/i],
    ['3D / pose', /3d|pose|trajectory|mocap|geometry|depth|slam|6dof|hand|body|mesh/i],
    ['Contact', /contact|force|pressure|tactile|touch/i],
    ['Gaze', /gaze|attention|eye[- ]?track/i],
    ['IMU', /imu|inertial|accelerometer|gyroscope/i],
    ['Ego–exo', /ego.{0,3}exo|exo.{0,3}ego|multi[- ]?view|third[- ]?person/i],
    ['Language', /language|text|narrat|instruction|query|question|\bqa\b|caption/i],
    ['Robot action', /robot|action|policy|retarget|control|teleop|manipulation|end[- ]?effector/i],
  ];
  return tests.filter(([, regex]) => regex.test(value)).map(([signal]) => signal);
}

function inferTasks(value: string): Task[] {
  const tests: Array<[Task, RegExp]> = [
    ['Manipulation', /manipulat|hand[- ]?object|object interaction|dexter|grasp|pick|assembly|tactile|contact|affordance|tool use|kitchen|bimanual/i],
    ['Navigation', /navigat|mapping|locali[sz]ation|spatial map|slam|wayfinding|exploration/i],
    ['Locomotion', /locomot|walking|gait|humanoid control|whole[- ]?body control|loco(man)?/i],
    ['Teleoperation', /teleop|imitation|demonstration|retarget|human[- ]?to[- ]?robot|cross[- ]?embod/i],
    ['Perception', /track|detect|segment|recognition|reconstruct|depth|pose estimation|scene understanding|object understanding/i],
    ['Human motion', /human motion|body pose|motion capture|mocap|avatar|full[- ]?body|upper[- ]?body/i],
    ['Assistance', /assist|intervention|proactive|instructional|mistake|guidance/i],
    ['Memory / QA', /memory|question|\bqa\b|vqa|reasoning|retrieval|long[- ]?form|long[- ]?context|episodic/i],
    ['Generation / world model', /generat|diffusion|synth|world model|novel[- ]?view|render|prediction|forecast/i],
    ['Agentic RSI', /recursive self[- ]?improv|self[- ]?improv|self[- ]?evolv|continual learning|lifelong|online (?:reinforcement )?learning|autonomous (?:practice|improvement|experience)|skill (?:library|harness)|policy refinement|experience[- ]driven/i],
  ];
  const result = tests.filter(([, regex]) => regex.test(value)).map(([task]) => task);
  return result.length ? result : ['General'];
}

const curatedRenderMethods: Record<string, RenderMethod[]> = {
  'Aria Digital Twin': ['Digital-twin rerender'],
  'EgoGen': ['3D engine / simulator'],
  'UnrealEgo': ['3D engine / simulator'],
  'EgoTV': ['3D engine / simulator'],
  'EgoInteract: Synthetic Egocentric Videos Generation for Interaction Understanding and Anticipation': ['3D engine / simulator'],
  'EgoSim': ['Video diffusion / world model'],
  'EgoControl': ['Video diffusion / world model'],
  'TASTE-Rob': ['Video diffusion / world model'],
  'EgoVid-5M': ['Video diffusion / world model'],
  'EgoTwin': ['Video diffusion / world model'],
  'EgoWorld': ['Video diffusion / world model'],
  'Exocentric-to-Egocentric Video Generation (Exo2Ego-V)': ['Video diffusion / world model', 'View translation / neural rendering'],
  'Egocentric Scene Reconstruction from an Omnidirectional Video': ['View translation / neural rendering'],
  'DreamDojo/DreamDojo-HV': ['Video diffusion / world model'],
  'EgoEngine: From Egocentric Human Videos to High-Fidelity Dexterous Robot Demonstrations': ['Embodiment compositing'],
  'Ego2Robot': ['Embodiment compositing'],
};

function inferRenderMethods(name: string): RenderMethod[] {
  return curatedRenderMethods[name] || [];
}

const curatedDataProvenance: Record<string, DataProvenance[]> = {
  'Aria Digital Twin': ['Real capture', 'Hybrid real + rerender'],
  'EgoGen': ['Synthetic simulation'],
  'UnrealEgo': ['Synthetic simulation'],
  'EgoTV': ['Synthetic simulation'],
  'EgoInteract: Synthetic Egocentric Videos Generation for Interaction Understanding and Anticipation': ['Synthetic simulation'],
  'EgoSim': ['Generated video'],
  'EgoControl': ['Generated video'],
  'TASTE-Rob': ['Real capture', 'Generated video'],
  'EgoVid-5M': ['Real capture', 'Generated video'],
  'EgoTwin': ['Generated video'],
  'EgoWorld': ['Generated video'],
  'Exocentric-to-Egocentric Video Generation (Exo2Ego-V)': ['Real capture', 'Generated video'],
  'Egocentric Scene Reconstruction from an Omnidirectional Video': ['Real capture'],
  'DreamDojo/DreamDojo-HV': ['Real capture', 'Generated video'],
  'EgoEngine: From Egocentric Human Videos to High-Fidelity Dexterous Robot Demonstrations': ['Real capture', 'Hybrid real + rerender'],
  'Ego2Robot': ['Real capture', 'Hybrid real + rerender'],
  'MobileEgo Anywhere/STERA/STERA-10M': ['Real capture'],
  'ACE-Ego-Hand: Repurposing Video Diffusion Models for Occlusion-Robust Egocentric 3D Hand Motion Recovery': ['Real capture'],
  'UniData Egocentric Dataset for Physical AI and Robotics': ['Real capture'],
  'HomER v2: Home Egocentric Robotics Dataset': ['Real capture'],
  'Humanola Egocentric Hand-Pose Sample': ['Real capture'],
  'GEN-1: Towards Machines with a Thousand Hands': ['Real capture'],
  'GEN-1.5: Embodied Foundation Models are One-Shot Learners': ['Real capture', 'Synthetic simulation'],
};

function inferDataProvenance(name: string): DataProvenance[] {
  return curatedDataProvenance[name] || [];
}

function inferScenes(value: string, scale: string): Pick<LibraryEntry, 'scenes' | 'sceneCoverage'> {
  const tests: Array<[SceneGroup, RegExp]> = [
    ['Indoor', /indoor|inside|kitchen|household|home|apartment|living room|bedroom|office|classroom|laborator|tabletop|workbench|factory|warehouse|building/i],
    ['Outdoor', /outdoor|street|campus|sidewalk|trail|hiking|cycling|open[- ]air/i],
    ['Tabletop / workbench', /tabletop|table-top|workbench|desktop|countertop|robot arm|bench task|manipulation benchmark/i],
    ['Room-scale / building', /room[- ]scale|room|building|apartment|house-scale|indoor environment|navigation|wayfinding|spatial map|exploration/i],
    ['Industrial / warehouse', /workshop|factory|industrial|warehouse|manufactur|logistics|construction|production line/i],
    ['Kitchen / household', /kitchen|cooking|food|meal|household|home|apartment|daily[- ]life|living room|bedroom/i],
    ['Office / social', /office|classroom|school|meeting|conversation|social interaction|care|assistive/i],
    ['Urban / road', /urban|driving|driver|road|street|vehicle|car|traffic|sidewalk|city/i],
    ['Sports / skilled activity', /sport|dance|music|basketball|soccer|tennis|bike repair|skilled activit/i],
    ['Synthetic / simulation', /synthetic|simulation|simulated|virtual|rendered|game engine|isaac|mujoco/i],
    ['Mixed / in-the-wild', /in[- ]the[- ]wild|open[- ]domain|diverse scene|multiple environments?|locations?|countries|cities|contexts|everyday|internet video|indoor.{0,20}outdoor|outdoor.{0,20}indoor/i],
  ];
  const scenes = tests.filter(([, regex]) => regex.test(value)).map(([scene]) => scene);
  const resolved = scenes;
  const quantitative = scale.split(/[;·]/).map((item) => item.trim()).filter((item) => /\b(?:scene|location|countr|cit(?:y|ies)|kitchen|home|environment|room|site|space)s?\b/i.test(item)).slice(0, 3);
  return {scenes: resolved, sceneCoverage: quantitative.length ? `${resolved.join(' · ')} — ${quantitative.join(' · ')}` : resolved.join(' · ')};
}

function inferCamera(value: string): Pick<LibraryEntry, 'camera' | 'cameraGroup'> {
  if (/undistort|rectif/i.test(value)) return {camera: 'Rectification / undistortion reported', cameraGroup: 'Calibration / intrinsics'};
  if (/calibrat|intrinsic|distortion coefficients?|projection parameters?/i.test(value)) return {camera: 'Calibration / intrinsics reported · undistortion possible', cameraGroup: 'Calibration / intrinsics'};
  const models = [
    /kannala/i.test(value) && 'Kannala–Brandt',
    /pinhole/i.test(value) && 'pinhole',
    /fisheye|wide[- ]?fov/i.test(value) && 'fisheye / wide-FOV',
    /camera model/i.test(value) && 'camera model',
  ].filter(Boolean);
  if (models.length) return {camera: models.join(' + '), cameraGroup: 'Model family only'};
  return {camera: '', cameraGroup: null};
}

function inferCameraView(value: string): CameraView | null {
  const monocular = /\bmonocular\b|single[- ]camera|one camera|single RGB view/i.test(value);
  const stereo = /\bstereo(?:scopic)?\b|\bbinocular\b|two[- ]camera|dual[- ]camera/i.test(value);
  const multiview = /multi[- ]?(?:view|camera)|multiple (?:RGB[- ]?D |RGB )?(?:views|cameras)|\b[3-9]\s+(?:synchronized )?(?:RGB[- ]?D |RGB )?(?:views|cameras)|ego.{0,3}exo|exo.{0,3}ego/i.test(value);
  if ([monocular, stereo, multiview].filter(Boolean).length > 1 || /one\/multi[- ]?view/i.test(value)) return 'Mixed / variable';
  if (stereo) return 'Stereo / binocular';
  if (multiview) return 'Multi-camera / multiview';
  if (monocular) return 'Monocular';
  return null;
}

const curatedCameraMetadata: Record<string, {camera: string; cameraGroup: CameraGroup; cameraView?: CameraView}> = {
  'Ego-Exo4D': {camera: 'Per-camera intrinsics + 3D trajectories/extrinsics; Aria VRS calibration and aligned media released', cameraGroup: 'Calibration / intrinsics', cameraView: 'Mixed / variable'},
  'HD-EPIC': {camera: 'Static device calibration, sensor-to-device transforms and per-frame device-to-world poses; pre-undistorted frames not stated', cameraGroup: 'Calibration / intrinsics'},
  'DIV-FF': {camera: 'Calibrated egocentric video', cameraGroup: 'Calibration / intrinsics'},
  'Aria Digital Twin': {camera: '6DoF device/object/human poses with gaze, depth, masks and synthetic views', cameraGroup: 'Calibration / intrinsics', cameraView: 'Mixed / variable'},
  'HoloAssist': {camera: 'RGB/depth calibration package; rectification is possible from released parameters', cameraGroup: 'Calibration / intrinsics', cameraView: 'Mixed / variable'},
  'Ego-Humans / EgoFormer': {camera: 'Localized cameras and parameters released; pre-undistorted imagery not established', cameraGroup: 'Calibration / intrinsics', cameraView: 'Mixed / variable'},
  'EgoBody': {camera: 'HoloLens plus calibrated multi-Kinect capture', cameraGroup: 'Calibration / intrinsics', cameraView: 'Mixed / variable'},
  'Photoreal Scene Reconstruction from an Egocentric Device': {camera: 'Aria/Quest RGB rolling-shutter calibration plus high-rate visual-inertial trajectory', cameraGroup: 'Calibration / intrinsics', cameraView: 'Mixed / variable'},
  'EPIC Fields': {camera: 'Per-frame intrinsics and extrinsics', cameraGroup: 'Calibration / intrinsics', cameraView: 'Monocular'},
  'DenseGrounding': {camera: 'Calibrated egocentric multiview RGB-D', cameraGroup: 'Calibration / intrinsics', cameraView: 'Multi-camera / multiview'},
  'EgoDex': {camera: 'Calibrated multiview capture with SLAM and per-joint 3D hand/finger tracks', cameraGroup: 'Calibration / intrinsics', cameraView: 'Multi-camera / multiview'},
  'Egocentric-100K (Build)': {camera: 'Build AI Gen 1 · Kannala–Brandt fisheye intrinsics with k1–k4; undistortion possible, frames not stated pre-undistorted', cameraGroup: 'Calibration / intrinsics', cameraView: 'Monocular'},
  'RoboTube': {camera: 'Two synchronized first-/third-person RGB + depth views; precise camera model/calibration not published', cameraGroup: 'Model family only', cameraView: 'Multi-camera / multiview'},
};

function inferCaptureDevices(value: string): CaptureDevice[] {
  const tests: Array<[CaptureDevice, RegExp]> = [
    ['Meta Aria', /(?:project )?aria(?: glasses| device| rig)?\b/i],
    ['Apple Vision Pro', /(?:apple )?(?:vision pro|\bAVP\b)/i],
    ['GoPro', /\bgopro\b/i],
    ['Insta360', /\binsta[ -]?360\b/i],
    ['iPhone / smartphone', /\biphone\b|smartphone|android phone/i],
    ['Intel RealSense', /(?:intel )?realsense\b/i],
    ['Azure Kinect', /azure kinect/i],
    ['ZED', /\bzed(?: ?2(?:i)?)?\b/i],
    ['HoloLens', /\bhololens\b/i],
    ['VR / Quest headset', /\b(?:meta )?quest\b|\boculus\b|vr headset/i],
    ['Other named capture rig', /(?:helmet-mounted|chest-mounted|head-mounted) (?:rig|camera system)|\b(?:oak-d|orbbec|xperience)\b/i],
  ];
  return tests.filter(([, regex]) => regex.test(value)).map(([device]) => device);
}

// These names are confirmed in the linked first-party documentation but are
// not always repeated in the compact source-table modality column.
const curatedCaptureDevices: Record<string, CaptureDevice[]> = {
  'Ego4D': ['GoPro'],
  'Ego-Exo4D': ['Meta Aria', 'GoPro'],
  'EgoLife / EgoButler': ['Meta Aria', 'GoPro'],
  'CaptainCook4D': ['GoPro', 'HoloLens'],
};

function inferRobotInterfaces(value: string): RobotInterface[] {
  const tests: Array<[RobotInterface, RegExp]> = [
    ['Parallel-jaw gripper', /parallel[- ]?jaw|two[- ]?finger gripper|robotiq|panda gripper|gripper/i],
    ['Dexterous hand', /dexterous (?:hand|manipulation)|multi[- ]?finger|(?:inspire|allegro|shadow) hand|(?:6|12|16|22|24)[- ]?dof hand/i],
    ['Single-arm / single-hand', /single[- ]?(?:arm|hand)|one[- ]?(?:arm|hand)|franka|ur5|robot arm/i],
    ['Bimanual', /bimanual|dual[- ]?arm|two[- ]?arm/i],
    ['Humanoid / whole-body', /humanoid|whole[- ]?body|unitree|h1\b|g1\b/i],
  ];
  return tests.filter(([, regex]) => regex.test(value)).map(([item]) => item);
}

const curatedRobotInterfaces: Record<string, RobotInterface[]> = {
  'DROID': ['Parallel-jaw gripper', 'Single-arm / single-hand'],
  'RoboMIND': ['Parallel-jaw gripper', 'Dexterous hand', 'Single-arm / single-hand'],
  'EgoVLA': ['Dexterous hand', 'Humanoid / whole-body'],
  'UniDex': ['Dexterous hand', 'Single-arm / single-hand'],
  'DexCap / DexIL': ['Dexterous hand', 'Single-arm / single-hand'],
  'Do As I Do': ['Dexterous hand', 'Single-arm / single-hand'],
  'EgoMimic': ['Parallel-jaw gripper', 'Single-arm / single-hand'],
  'Human2Sim2Robot': ['Parallel-jaw gripper', 'Single-arm / single-hand'],
};

function inferCapabilities(value: string, kinds: Kind[]): Capability[] {
  const tests: Array<[Capability, RegExp]> = [
    ['Reconstruction / geometry', /reconstruct|reconstruction|3d geometry|mesh|point cloud|depth estimation|pose estimation|neural radiance|gaussian splat/i],
    ['Rendering / novel view', /render|novel[- ]?view|relight|neural rendering|view synthesis|photoreal/i],
    ['Understanding / recognition', /understand|recognition|classif|detect|segment|reason|qa|question answer|retrieval|forecast|anticipat/i],
    ['Tracking / localization', /track|tracking|locali[sz]|slam|trajectory|camera pose|mapping/i],
    ['Generation / world model', /generat|diffusion|world model|synthesi[sz]|predict future/i],
    ['Simulation', /simulat|mujoco|isaac|digital twin|synthetic/i],
    ['Retargeting / embodiment transfer', /retarget|human[- ]?to[- ]?robot|embodiment transfer|inverse kinematic|\bIK\b/i],
    ['Policy learning / control', /policy|control|imitation learning|behavior cloning|reinforcement learning|robot actions?/i],
    ['Data capture / annotation', /dataset|benchmark|annotation|capture|labels?/i],
  ];
  const inferred = tests.filter(([, regex]) => regex.test(value)).map(([item]) => item);
  if (kinds.includes('Dataset') && !inferred.includes('Data capture / annotation')) inferred.push('Data capture / annotation');
  return inferred;
}

function inferGeometryLayers(value: string): GeometryLayer[] {
  const tests: Array<[GeometryLayer, RegExp]> = [
    ['Body reconstruction', /\b(?:smpl|body pose|body mesh|human body|whole[- ]?body|human motion|mocap|skeleton)\b/i],
    ['Hand reconstruction', /\b(?:mano|hand pose|hand mesh|hand tracking|articulated hand|dexterous hand)\b/i],
    ['Object reconstruction', /\b(?:object pose|object mesh|object geometry|object model|object point cloud|object reconstruction|foundationpose|6dof object)\b/i],
    ['Human–object interaction (HOI)', /\b(?:hand[- ]?object|human[- ]?object|hand object interaction|hoi\b|grasp affordance|interaction reconstruction)\b/i],
    ['Scene / environment reconstruction', /\b(?:slam|mapping|camera pose|locali[sz]ation|scene reconstruction|scene geometry|radiance field|gaussian splat|novel view|digital twin|place recognition|loop closure)\b/i],
    ['Physics / dynamics', /\b(?:physics|physical dynamics|contact dynamics|rigid[- ]?body|deformable|kinematics|dynamics)\b/i],
  ];
  return tests.filter(([, regex]) => regex.test(value)).map(([layer]) => layer);
}

function inferSystemLayers(value: string): SystemLayer[] {
  const tests: Array<[SystemLayer, RegExp]> = [
    ['Perception / state estimation', /\b(?:slam|mapping|locali[sz]ation|camera pose|state estimation|depth|object pose|tracking)\b/i],
    ['Simulation / rendering', /\b(?:simulation|simulator|physics engine|render|rtx|omniverse|mujoco|isaac sim|sapien|robosuite|maniskill)\b/i],
    ['Physical / embodiment', /\b(?:humanoid|whole[- ]?body|robot model|urdf|mjcf|actuator|contact sensor|jetson|physical ai|teleop)\b/i],
    ['Planning / control', /\b(?:motion planning|trajectory optimization|inverse kinematic|collision check|controller|mpc|control)\b/i],
    ['Data / runtime', /\b(?:dataset|data collection|replay|deployment|runtime|rlds|lerobot|ros\s?2|usd)\b/i],
    ['RL / training infrastructure', /\b(?:reinforcement learning|\brl\b|rllib|rlinf|rsl[- ]?rl|torchrl|distributed training|rollout worker)\b/i],
    ['World model / synthetic data', /\b(?:world model|synthetic data|domain randomization|cosmos|nurec|generative world|video generation)\b/i],
  ];
  return tests.filter(([, regex]) => regex.test(value)).map(([layer]) => layer);
}

function inferLibraryCategory(name: string, venue: string, role: string): LibraryCategory {
  const toolNames = /^(?:cuRobo|MuJoCo|Isaac Lab|robosuite|ManiSkill(?:3)?|LeRobot|NVIDIA |RLinf$|TorchRL|RSL-RL|i3dgs|Inspect Robots|Waddle:)/i;
  return toolNames.test(name) || /^(?:system|platform)\s*·/i.test(venue) || /toolkit/i.test(role)
    ? 'Tool / platform'
    : 'Method / paper';
}

function inferAgenticTags(value: string): Pick<LibraryEntry, 'agenticWorkflows' | 'agenticModules' | 'agenticLayers' | 'feedbackSignals'> {
  const workflows: Array<[AgenticWorkflow, RegExp]> = [
    ['Propose / design', /propos|synthesi[sz]e|design|curriculum|task generation|hypothesis|reflect/i],
    ['Execute / collect', /rollout|execute|practice|data collection|interaction|explor|sandbox|real.robot/i],
    ['Evaluate / verify', /verif|evaluat|success (?:detector|label)|reward|feedback|benchmark|test/i],
    ['Update / consolidate', /improv|updat|retrain|fine.tun|consolidat|distill|retain|lifelong|continual/i],
    ['Deploy / monitor', /deploy|runtime|monitor|physical robot|real.robot|rollback/i],
  ];
  const modules: Array<[AgenticModule, RegExp]> = [
    ['Agent / policy', /agent|policy|vla|controller|foundation model/i],
    ['Skill / code library', /skill (?:library|graph|code|harness)|code.as.policy|program|utility skill/i],
    ['Environment / sandbox', /environment|sandbox|simulat|digital twin|gym|rollout/i],
    ['Evaluator / reward', /verifier|success (?:detector|label)|reward|critic|evaluat|feedback/i],
    ['Optimizer / search', /optim|search|evol|candidate|sampling|curriculum/i],
    ['Data / replay', /data|trajectory|replay|demonstration|experience|dataset|buffer/i],
  ];
  const layers: Array<[AgenticLayer, RegExp]> = [
    ['Improvement loop', /self.improv|iterative|continual|lifelong|practice|refinement|evol/i],
    ['Harness / orchestration', /harness|orchestrat|workflow|runtime|pipeline|branch/i],
    ['Memory / provenance', /memory|library|retain|replay|experience|version|provenance|branch/i],
    ['World model / simulator', /world model|simulat|digital twin|synthetic|render/i],
    ['Safety / rollback', /safety|safe|rollback|risk|reset|guardrail/i],
    ['Benchmark / evaluation', /benchmark|bench|evaluat|protocol|held.out|test suite/i],
  ];
  const feedback: Array<[FeedbackSignal, RegExp]> = [
    ['Visual / render discrepancy', /visual difference|render(?:er|ing)? feedback|image comparison|pixel|rgb|camera|view synthesis/i],
    ['Task success / verifier', /verifier|success (?:detector|label)|success gate|task success|validation/i],
    ['Dense progress / reward', /reward|progress|value|advantage|return|reinforcement learning/i],
    ['Human correction / preference', /human (?:seed|correction|feedback|demonstration|preference)|teleop|user/i],
    ['Environment / physics state', /environment feedback|physics|collision|contact|state|simulat|trajectory/i],
    ['Safety / constraint', /safety|safe|constraint|rollback|reset|risk|guardrail/i],
  ];
  const tagged = <T,>(tests: Array<[T, RegExp]>) => tests.filter(([, regex]) => regex.test(value)).map(([tag]) => tag);
  return {agenticWorkflows: tagged(workflows), agenticModules: tagged(modules), agenticLayers: tagged(layers), feedbackSignals: tagged(feedback)};
}

function describeAgenticDesign(
  modules: AgenticModule[],
  feedback: FeedbackSignal[],
  layers: AgenticLayer[],
): string {
  const moduleChoices: Partial<Record<AgenticModule, string>> = {
    'Agent / policy': 'an agent or policy proposes the next behavior',
    'Skill / code library': 'reusable skills or code externalize what was learned',
    'Environment / sandbox': 'an environment or sandbox executes candidate changes',
    'Evaluator / reward': 'an evaluator gates candidate acceptance',
    'Optimizer / search': 'search or optimization chooses the next candidate',
    'Data / replay': 'experience is retained for replay or retraining',
  };
  const choices = modules.map((module) => moduleChoices[module]).filter(Boolean);
  const persistence = layers.includes('Memory / provenance')
    ? 'Evidence is retained with provenance for the next cycle.'
    : layers.includes('Improvement loop')
      ? 'The mechanism iterates improvements across episodes.'
      : '';
  const parts = [choices.length ? `Design: ${choices.join('; ')}.` : '', feedback.length ? `Gate: ${feedback.join(' + ')}.` : '', persistence].filter(Boolean);
  return parts.join(' ');
}

const reportedComputeCost: Record<string, string> = {
  'Waddle: Agents that Control Robots': 'Interaction budget: the LEGO data-collection example repeated around 1,000 times overnight; the post reports a working policy in 20 minutes for one example.',
  'Claude Plays Robotics': 'Evaluation setup: code/direct-control jobs typically use 16 CPUs and 48 GB RAM with a 24-hour wall limit; RL uses one GPU per job for 1.5-hour classic-control or 4-hour Go2/G1 sessions.',
  'Inspect Robots': 'Evaluation-harness cost follows the selected policy, embodiment, simulator or physical robot.',
  'Project Fetch: Can Claude Train a Robot Dog?': 'Human-study budget: eight Anthropic researchers split into two teams.',
  'Robots That Learn': 'Data budget: hundreds of thousands of simulated vision images plus dozens of tasks with thousands of demonstrations each.',
  'LiteReality-Agent': 'Project reports OpenAI reference-image generation at typically under US$1 per scene; TRELLIS / GroundingDINO require hosted Modal compute or a ≥24 GB Linux GPU.',
  'RoboCat: A Self-Improving Generalist Agent': 'Interaction budget: about 10k practice trials per task spin-off.',
  'SOAR: Autonomous Improvement of Instruction Following Skills': 'Data / interaction budget: 30k+ trajectories and 3M transitions.',
  'ARCHITECT: Language Guided Robot Policy Synthesis': 'Physical evaluation budget: 10 trials for each of 8 Franka tasks.',
  'Eureka: Human-Level Reward Design via Coding LLMs': 'GPU simulation spans 29 environments and 10 morphologies.',
  'RoboCasa365 lifelong benchmark': 'Benchmark asset budget: 2,200+ demonstration hours across 365 tasks / 2,500 scenes.',
};

function computeCostFor(name: string): string {
  return (reportedComputeCost[name] || '')
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !/\bnot reported\b/i.test(sentence))
    .join(' ');
}

const reportedLimitations: Record<string, string> = {
  'Waddle: Agents that Control Robots': 'The evidence is a company research post and early-access product, rather than a peer-reviewed benchmark. Its own next steps identify tool-interface design, standardized evaluation and training agents from intervention traces as unfinished work.',
  'Claude Plays Robotics': 'Anthropic reports that direct joint control mostly fails; long-horizon full-task success remains rare, and current models fail at stable spatial memory, self-localization and long open-loop plans. The code is announced but not yet released.',
  'Inspect Robots': 'Repository states it is in early development and its API may change between releases; users should pin a version before depending on it.',
  'Project Fetch: Can Claude Train a Robot Dog?': 'This is a small internal human-with-AI study (eight researchers) rather than an autonomous robot-learning or persistent-RSI evaluation.',
  'Robots That Learn': 'A historical, task-specific sim-to-real one-shot-imitation demonstration, not an agentic loop that retains and autonomously improves skills across tasks.',
  'LiteReality-Agent': 'Project explicitly states scenes are not yet simulation-ready and have not been stress-tested at scale; current experiments focus on single rooms of approximately 50 m² or less.',
  'CaP-X: Benchmarking and Improving Coding Agents for Robot Manipulation': 'The source record bounds the loop by its primitive library, task distribution, evaluator and retry budget; it is not evidence of open-ended self-improvement.',
  'SHAPER: Self-Evolving Embodied Agents via Skill-Harness Evolution': 'Reported scope: evolves reusable skills and harness with a frozen foundation model, rather than parameter training.',
  'RoboCat: A Self-Improving Generalist Agent': 'Reported practical constraint: each task spin-off requires about 10k practice trials; the evaluation spans four robot types rather than unrestricted embodiments.',
  'Voyager': 'Reported evaluation scope is Minecraft open-world exploration, so its results are a non-physical embodied-agent reference rather than robot-hardware evidence.',
  'STOP: Self-Taught Optimizer': 'Reported scope is executable code-generation evaluation; it is a non-embodied recursive-improvement reference.',
};

function limitationsFor(name: string): string {
  return reportedLimitations[name] || 'Not explicitly discussed in the linked source record.';
}

function inferComponents(value: string): SharedComponent[] {
  const tests: Array<[SharedComponent, RegExp]> = [
    ['Retargeting', /retarget/i],
    ['Inverse kinematics (IK)', /inverse[- ]?kinematics?|\b(?:fingertip|arm|differential|closed[- ]?loop)?\s*IK\b/i],
    ['MANO', /\bMANO\b/i],
    ['SMPL / SMPL-X', /\bSMPL(?:-X)?\b/i],
    ['HaWoR', /\bHaWoR\b/i],
    ['WiLoR', /\bWiLoR(?:-mini)?\b/i],
    ['VGGT', /\bVGGT\b/i],
    ['MoGe', /\bMoGe(?:-2)?\b/i],
    ['SLAM', /\bSLAM\b/i],
    ['DINOv2', /\bDINOv2\b/i],
    ['DINOv3', /\bDINOv3\b/i],
    ['SAM 2', /\bSAM[- ]?2\b|Grounded[- ]SAM[- ]2/i],
    ['SAM 3', /\bSAM[- ]?3\b|Grounded[- ]SAM[- ]3/i],
    ['Depth Anything 2', /\bDepth[- ]?Anything[- ]?(?:V?2|2)\b|\bDA2\b/i],
    ['Depth Anything 3', /\bDepth[- ]?Anything[- ]?(?:V?3|3)\b|\bDA3\b/i],
    ['FoundationPose', /\bFoundationPose\+*\b/i],
    ['SpatialTracker', /\bSpatialTrackerV?2?\b/i],
    ['cuRobo', /\bcuRobo\b/i],
  ];
  return tests.filter(([, regex]) => regex.test(value)).map(([component]) => component);
}

function inferComponentFamilies(components: SharedComponent[]): ComponentFamily[] {
  const result = new Set<ComponentFamily>();
  components.forEach((component) => {
    if (/^DINOv\d$/i.test(component)) result.add('DINO');
    else if (/^SAM \d$/i.test(component)) result.add('SAM');
    else if (/^Depth Anything \d$/i.test(component)) result.add('Depth Anything');
    else if (component === 'Retargeting' || component === 'Inverse kinematics (IK)') result.add('Retargeting / IK');
    else if (component === 'MANO' || component === 'SMPL / SMPL-X' || component === 'HaWoR' || component === 'WiLoR') result.add('Human body / hand');
    else if (component === 'VGGT' || component === 'MoGe' || component === 'SLAM' || component === 'SpatialTracker' || component === 'FoundationPose') result.add('Geometry / tracking');
    else if (component === 'cuRobo') result.add('Robot planning');
  });
  return [...result];
}

function inferInputGroups(value: string): InputGroup[] {
  const tests: Array<[InputGroup, RegExp]> = [
    ['RGB / video', /rgb|video|image|camera|frame|visual/i],
    ['Depth / RGB-D', /rgb[- ]?d|depth|point cloud/i],
    ['Multiview', /multi[- ]?view|stereo|ego.{0,3}exo|exo.{0,3}ego|multiple cameras?/i],
    ['Language', /language|text|narrat|instruction|command|caption/i],
    ['Audio', /audio|speech|microphone/i],
    ['Gaze', /gaze|eye[- ]?track|attention/i],
    ['IMU', /imu|inertial|accelerometer|gyroscope/i],
    ['Hand / body pose', /hand|body|pose|mocap|skeleton|mano|smpl/i],
    ['Robot state / action', /robot|proprio|joint|action|control|gripper|end[- ]?effector/i],
    ['Tactile / contact', /tactile|contact|force|pressure|haptic/i],
    ['Human demonstration', /human|demonstration|wearable|teleop|in-the-wild/i],
    ['Synthetic / simulation', /synthetic|simulation|simulated|render/i],
  ];
  const result = tests.filter(([, regex]) => regex.test(value)).map(([group]) => group);
  return result.length ? result : ['Other input'];
}

function inferOutputGroups(value: string): OutputGroup[] {
  const tests: Array<[OutputGroup, RegExp]> = [
    ['Dataset / labels', /dataset|corpus|annotation|label|pair|episode|clip|primitive/i],
    ['Hand / body motion', /hand|body|pose|motion|mano|smpl|skeleton|wrist/i],
    ['3D geometry / map', /3d|geometry|depth|point cloud|mesh|map|reconstruct|scene/i],
    ['Camera / trajectory', /camera|slam|trajectory|extrinsic|intrinsic|locali[sz]ation/i],
    ['Language / QA', /language|text|caption|question|answer|\bqa\b|narrat/i],
    ['Robot actions / demos', /robot|action|demonstration|retarget|joint command|rollout/i],
    ['Policy / control', /policy|control|vision[-– ]language[-– ]action|\bvla\b/i],
    ['Generated media', /generat|render|novel view|video|image synthesis|diffusion/i],
    ['Perception / tracking', /track|detect|segment|recognition|affordance|object box/i],
    ['Benchmark / evaluation', /benchmark|evaluation|task|challenge/i],
  ];
  const result = tests.filter(([, regex]) => regex.test(value)).map(([group]) => group);
  return result.length ? result : ['Other output'];
}

function inferBenchmarks(value: string): BenchmarkId[] {
  const tests: Array<[BenchmarkId, RegExp]> = [
    ['Ego-Exo4D', /\bEgo[-– ]?Exo4D\b/i],
    ['Ego4D', /\bEgo4D\b/i],
    ['EPIC-KITCHENS', /\bEPIC[-– ]?KITCHENS(?:-100)?\b/i],
    ['EgoSchema', /\bEgoSchema\b/i],
    ['HOT3D', /\bHOT3D\b/i],
    ['HOI4D', /\bHOI4D\b/i],
    ['Assembly101', /\bAssembly[-– ]?101\b/i],
    ['FreiHAND', /\bFreiHAND\b/i],
    ['HO3D', /\bHO3D(?:v\d)?\b/i],
    ['DexYCB', /\bDexYCB\b/i],
    ['DTU', /\bDTU\b/],
    ['ETH3D', /\bETH3D\b/i],
    ['ScanNet', /\bScanNet(?:-1500)?\b/i],
    ['LIBERO', /\bLIBERO(?:-LONG)?\b/i],
    ['CALVIN', /\bCALVIN\b/i],
    ['RLBench', /\bRLBench\b/i],
    ['Meta-World', /\bMeta[-– ]?World\b/i],
    ['ManiSkill', /\bManiSkill\b/i],
    ['RoboCasa', /\bRoboCasa(?:365)?\b/i],
    ['BEHAVIOR', /\bBEHAVIOR(?:-1K)?\b/i],
  ];
  return tests.filter(([, regex]) => regex.test(value)).map(([benchmark]) => benchmark);
}

function curatedBenchmarks(name: string): BenchmarkId[] {
  if (/^HaWoR\b/i.test(name)) return ['DexYCB', 'HOT3D'];
  if (/^WiLoR\b/i.test(name)) return ['FreiHAND', 'HO3D'];
  if (/^VGGT\b/i.test(name)) return ['DTU', 'ETH3D', 'ScanNet'];
  if (/^MoGe\b/i.test(name)) return ['ETH3D'];
  if (/^Do As I Do\b/i.test(name)) return ['DexYCB', 'HOI4D'];
  return [];
}

function inferComparisonMetrics(kinds: Kind[], tasks: Task[]): string[] {
  const metrics: string[] = [];
  if (kinds.includes('Dataset')) metrics.push('hours / clips / episodes ↑', 'subjects / sites / tasks ↑', 'annotation coverage ↑');
  if (kinds.includes('Pipeline')) metrics.push('end-to-end task success ↑', 'stage failure / retarget error ↓', 'runtime / latency ↓');
  if (kinds.includes('General model')) {
    if (tasks.includes('Human motion')) metrics.push('MPJPE / PA-MPJPE / PVE ↓');
    if (tasks.includes('Perception') || tasks.includes('Navigation')) metrics.push('mAP / F1 / recall ↑', 'depth / pose / track error ↓');
    if (tasks.includes('Memory / QA')) metrics.push('QA accuracy / recall@K ↑');
    if (tasks.includes('Generation / world model')) metrics.push('FVD / FID ↓', 'geometry consistency ↑');
    if (!metrics.length) metrics.push('task accuracy / success ↑', 'latency / error ↓');
  }
  if (kinds.includes('Policy')) metrics.push('task success / progress ↑', 'chain length / horizon ↑', 'interventions / resets ↓', 'cycle time / latency ↓');
  return Array.from(new Set(metrics)).slice(0, 5);
}

function curatedEvaluations(name: string): EvaluationSummary[] {
  if (/^Emergence of Human-to-Robot Transfer in VLAs$/i.test(name)) return [{
    benchmark: 'PI four-scenario human-to-robot generalization suite',
    stage: 'downstream policy',
    track: 'bussing · spice · dresser · colored-egg sorting; π0.5 baseline versus π0.5 + ego co-finetuning',
    metrics: 'average task performance ≈2× ↑ with ego data',
    protocol: 'Publisher-reported custom',
    comparabilityKey: 'PI human-to-robot / four scenarios / pi0.5 / ego co-finetuning',
  }];
  if (/^GEN-1\.5:/i.test(name)) return [{
    benchmark: 'Generalist ten-task adaptation suite',
    stage: 'end-to-end',
    track: '3–12 s one-shot physical prompt versus 10 gradient steps on 5 min/task',
    metrics: '59% ±10% one-shot success · 83% ±9% few-step success ↑',
    protocol: 'Publisher-reported custom',
    comparabilityKey: 'GEN-1.5 / ten tasks / prompt-or-adaptation / success rate',
  }];
  if (/^HaWoR\b/i.test(name)) return [{
    benchmark: 'DexYCB + HOT3D',
    stage: 'tracking',
    track: 'camera-space and world-space egocentric hand reconstruction',
    metrics: 'PA / W / WA-MPJPE ↓ · ATE / RTE / acceleration ↓ · AUC-J ↑',
    protocol: 'Public protocol',
    comparabilityKey: 'HaWoR / dataset / alignment / metric / split',
  }];
  if (/^WiLoR\b/i.test(name)) return [{
    benchmark: 'FreiHAND + HO3D',
    stage: 'reconstruction',
    track: 'single and multi-hand MANO reconstruction',
    metrics: 'PA-MPJPE / PA-MPVPE ↓ · F@5 / F@15 / AUC-J / AUC-V ↑',
    protocol: 'Public protocol',
    comparabilityKey: 'WiLoR / hand benchmark / alignment / metric / split',
  }];
  if (/^VGGT\b/i.test(name)) return [{
    benchmark: 'DTU + ETH3D + ScanNet-1500',
    stage: 'reconstruction',
    track: 'feed-forward camera, depth and point reconstruction',
    metrics: 'camera AUC ↑ · Chamfer accuracy / completeness ↓ · runtime ↓',
    protocol: 'Public protocol',
    comparabilityKey: 'VGGT / feed-forward-or-BA / benchmark / metric',
  }];
  if (/^MoGe\b/i.test(name)) return [{
    benchmark: 'NYUv2 + KITTI + ETH3D + open-domain geometry suites',
    stage: 'reconstruction',
    track: 'affine- or scale-invariant monocular geometry',
    metrics: 'relative point/depth error ↓ · δ1 ↑ · FOV angular error ↓',
    protocol: 'Public protocol',
    comparabilityKey: 'MoGe / affine-or-scale invariant / benchmark / metric',
  }];
  if (/^EgoVLA\b/i.test(name)) return [{
    benchmark: 'Ego Humanoid Manipulation Benchmark',
    stage: 'end-to-end',
    track: '12 tasks · short/long × seen/unseen · Unitree H1 + Inspire hands',
    metrics: 'SR / progress ↑: 77.78 / 84.92 seen-short; 28.79 / 69.11 unseen-long',
    protocol: 'Publisher-reported custom',
    comparabilityKey: 'EgoVLA benchmark / v3 / split / SR-PSR',
  }];
  if (/^DexImit\b/i.test(name)) return [
    {
      benchmark: 'DexImit 100-task author suite',
      stage: 'reconstruction',
      track: '4D object-trajectory reconstruction',
      metrics: 'reconstruction success 82% ↑',
      protocol: 'Publisher-reported custom',
      comparabilityKey: 'DexImit / 100-task suite / reconstruction success',
    },
    {
      benchmark: 'DexImit six-task downstream suite',
      stage: 'downstream policy',
      track: 'DP3 trained from 100 generated demonstrations per video',
      metrics: 'per-task success 52–100% ↑',
      protocol: 'Publisher-reported custom',
      comparabilityKey: 'DexImit / six simulated tasks / DP3 / task success',
    },
  ];
  if (/^Do As I Do\b/i.test(name)) return [
    {
      benchmark: 'DexYCB + HOI4D',
      stage: 'reconstruction',
      track: 'hand-object reconstruction',
      metrics: 'F-5 / F-10 ↑ · Chamfer ↓',
      protocol: 'Public protocol',
      comparabilityKey: 'Do As I Do / reconstruction / dataset / metric',
    },
    {
      benchmark: 'Reconstructed references + OakInk2',
      stage: 'retargeting',
      track: '655 reconstructed + 1,352 motion-capture trajectories',
      metrics: 'retarget success 71% / 81% ↑; position / rotation error ↓',
      protocol: 'Publisher-reported custom',
      comparabilityKey: 'Do As I Do / retargeting / source suite / thresholds',
    },
  ];
  if (/^Vinci2$/i.test(name)) return [{
    benchmark: 'EgoServe',
    stage: 'end-to-end',
    track: 'proactive intervention over EgoLife + HoloAssist + CaptainCook4D',
    metrics: 'Overall F1 8.0 ↑ · LLM response score 2.8/5 ↑ · 10 service categories / 4 horizons',
    protocol: 'Publisher-reported custom',
    comparabilityKey: 'EgoServe / source subset / temporal tolerance / service category / judge',
  }];
  if (/^DreamDojo\b/i.test(name)) return [{
    benchmark: 'DreamDojo OOD evaluation suite',
    stage: 'end-to-end',
    track: 'In-lab + EgoDex + DreamDojo-HV novel interactions; real-time long-horizon student',
    metrics: 'physics correctness / action following preference ↑ · PSNR ↑ · 640×480 at 10.81 FPS · >1 min rollout',
    protocol: 'Publisher-reported custom',
    comparabilityKey: 'DreamDojo / released eval sets / checkpoint size / action condition / judge protocol',
  }];
  return [];
}

function accessGroup(value: string): LibraryEntry['accessGroup'] {
  if (/gated|request|application|registration|controlled[- ]access|accept(?:ing)? terms/i.test(value)) return 'Gated / request';
  if (/open|released|public|download/i.test(value)) return 'Open';
  if (/announc|forthcoming|pending/i.test(value)) return 'Announced';
  if (/paper|code only|project page/i.test(value)) return 'Paper / code';
  if (/preview|claim|commercial|private/i.test(value)) return 'Preview / claim';
  return 'Paper / code';
}

const durationSummaries: Record<string, SequenceDuration> = {
  'Ego4D': {
    unit: 'clip', average: 'Benchmark-specific', distribution: 'FHO ≈5 min; NLQ mean 10 min, ≤20 min; VQ mean 6 min, ≤16 min; MQ mean 7.8 min, ≤8 min; AV ≈5 min', basis: 'Reported',
  },
  'HOI4D': {
    unit: 'video', average: '39.6 s', distribution: '44 h · 2.4M frames · 4,000 sequences', basis: 'Derived from reported total / count',
  },
  'Assembly101': {
    unit: 'video', average: '7.1 min ± 3.4 min', distribution: 'Mean ± standard deviation reported across sequences / videos', basis: 'Reported',
  },
  'Ego-Exo4D': {
    unit: 'take', average: '15.3 min', distribution: '1–42 min captures', basis: 'Derived from reported total / count',
  },
  'EPIC-KITCHENS-100 / Rescaling Egocentric Vision': {
    unit: 'video', average: '8.6 min', distribution: '100 h across 700 long videos; 89,977 action segments', basis: 'Derived from reported total / count',
  },
  'EPIC-KITCHENS VISOR': {
    unit: 'video', average: '12.1 min', distribution: '45 h across 223 untrimmed videos; 272K annotated frames', basis: 'Derived from reported total / count',
  },
  'EgoTracks': {
    unit: 'clip', average: '367.9 s', basis: 'Reported',
  },
  'HD-EPIC': {
    unit: 'video', average: '15.9 min ± 14.5 min', distribution: 'Mean ± standard deviation across 156 videos', basis: 'Reported',
  },
  'HoloAssist': {
    unit: 'recording', average: '4.48 min', distribution: '166 h across 2,221 recordings', basis: 'Derived from reported total / count',
  },
  'Aria Digital Twin': {
    unit: 'recording', distribution: '236 single-device sequences; each sequence exposes exact `duration_s` in the official explorer metadata', basis: 'Reported',
  },
  'EgoBody': {
    unit: 'recording', distribution: '125 sequences with exact start/end frames in the official release metadata', basis: 'Reported',
  },
  'EgoPressure': {
    unit: 'recording session', average: '≈1 h session', distribution: 'Session time includes instructions, tutorials and breaks', basis: 'Reported',
  },
  'EgoLife / EgoButler': {
    unit: 'participant week', average: '≈50 h', distribution: '≈8 h/day × 7 days per participant; long-form raw sessions, not pre-trimmed clips', basis: 'Reported',
  },
  'Nymeria': {
    unit: 'recording', average: '15 min', distribution: 'Duration includes eye-calibration time', basis: 'Reported',
  },
  'Aria Everyday Activities (AEA)': {
    unit: 'recording', average: '>3.1 min', distribution: '>7.5 h across 143 recordings', basis: 'Derived from reported total / count',
  },
  'CaptainCook4D': {
    unit: 'recording', average: '14.8 min', distribution: 'Official paper provides the recording-duration histogram', basis: 'Reported',
  },
  'EgoSchema': {
    unit: 'clip', average: '≈3 min', distribution: 'Curated three-minute clips', basis: 'Reported',
  },
  'Ego4D Goal-Step': {
    unit: 'segment', average: '32.3 s', distribution: '430 h across 48K step segments', basis: 'Derived from reported total / count',
  },
  'DROID': {
    unit: 'trajectory', average: '16.6 s', distribution: '76,000 trajectories across 350 h', basis: 'Derived from reported total / count',
  },
  'InterVLA / Perceiving and Acting in First-Person': {
    unit: 'recording', average: '10.5 s', distribution: '58.3 h across 20,000 sequences', basis: 'Derived from reported total / count',
  },
  'RoboMIND': {
    unit: 'trajectory', average: '10.3 s', distribution: '158–669 frames by robot type (Franka 179 · UR 158 · Humanoid 669 · AgileX 655)', basis: 'Derived from reported total / count',
  },
  'EgoDex': {
    unit: 'episode', average: '8.8 s', distribution: '61 h across 25,000 episodes', basis: 'Derived from reported total / count',
  },
  'EgoVerse': {
    unit: 'episode', average: '61.6 s', distribution: '1,362 h across 79,600 episodes in the paper snapshot', basis: 'Derived from reported total / count',
  },
  'BARISTA: A Multi-Task Egocentric Benchmark for Compositional Visual Understanding': {
    unit: 'video', average: '85.6 s', distribution: '~4.4 h across 185 videos', basis: 'Derived from reported total / count',
  },
  'EgoInteract: Synthetic Egocentric Videos Generation for Interaction Understanding and Anticipation': {
    unit: 'episode', average: '≈6.0 s', distribution: '1.9M frames across 10,534 episodes at 30 fps', basis: 'Derived from reported total / count',
  },
  'RekaDaily-10k (raw)': {
    unit: 'video', average: '71.0 s', distribution: '197 h across 10,000 rolling-corpus videos', basis: 'Derived from reported total / count',
  },
  'Egocentric-100K (Build)': {
    unit: 'clip', average: '180 s median', distribution: '2.01M clips across 100,405 h', basis: 'Reported',
  },
  'MobileEgo Anywhere/STERA/STERA-10M': {
    unit: 'recording session', average: '20.5 min', distribution: '584 sessions; maximum continuous session 104 min', basis: 'Reported',
  },
  'HomER v2: Home Egocentric Robotics Dataset': {
    unit: 'video', average: '7.81 min', distribution: '765 videos; approximately 4.7–30 min/video', basis: 'Derived from reported total / count',
  },
  'Humanola Egocentric Hand-Pose Sample': {
    unit: 'episode', average: '≈3 min', distribution: '9 episodes; 48,272 frames at 30 fps', basis: 'Derived from reported total / count',
  },
  'Vinci2': {
    unit: 'recording',
    average: 'EgoLife 6.37 h/day · HoloAssist 4.58 min/video · CaptainCook4D 12.71 min/recording',
    distribution: '128.50 h total: 95.50 h / 15 participant-days · 14.57 h / 191 videos · 18.44 h / 87 recordings; source units kept separate',
    basis: 'Derived from reported total / count',
  },
};

function sequenceDurationFor(name: string, kinds: Kind[]): SequenceDuration | null {
  if (!kinds.includes('Dataset')) return null;
  return durationSummaries[name] || null;
}

const companyRules: Array<{name: Company; pattern: RegExp}> = [
  {name: 'XDOF', pattern: /ABC-130K/i},
  {name: 'Ropedia', pattern: /Xperience-10M/i},
  {name: 'Lightwheel', pattern: /EgoSuite-Open100K/i},
  {name: 'Build', pattern: /Egocentric-100K/i},
  {name: 'Reka AI', pattern: /RekaDaily/i},
  {name: 'GenRobot', pattern: /Gen-EgoData/i},
  {name: 'JD', pattern: /EgoLive|JoyEgoCam/i},
  {name: 'NVIDIA', pattern: /DreamDojo|EgoScale|RoboCasa|MimicGen/i},
  {name: 'FPV Labs', pattern: /MobileEgo|STERA-10M/i},
  {name: 'Toloka', pattern: /HomER v2/i},
  {name: 'UniData', pattern: /UniData Egocentric/i},
  {name: 'Humanola', pattern: /Humanola Egocentric/i},
  {name: 'Physical Intelligence', pattern: /Emergence of Human-to-Robot Transfer in VLAs/i},
  {name: 'Generalist AI', pattern: /GEN-1(?:\.5)?:/i},
  {name: 'Apple', pattern: /EgoDex/i},
  {name: 'Meta', pattern: /^(?:Ego4D|Ego-Exo4D|Egocentric Video Task Translation|EgoPack|HOT3D|EgoLM|Aria Digital Twin|EgoObjects|Nymeria|EgoBody3M|EgoPoseFormer v2|egoEMOTION|Photoreal Scene Reconstruction from an Egocentric Device|LookOut|Aria Everyday Activities)/i},
  {name: 'Microsoft', pattern: /MoGe|VITRA/i},
  {name: 'Google', pattern: /Open X-Embodiment|RT-X/i},
];

function inferCompanies(value: string): Company[] {
  return companyRules.filter((item) => item.pattern.test(value)).map((item) => item.name);
}

const curatedDataFormats: Record<string, DataFormat[]> = {
  'ABC-130K / Scalable Behavior Cloning with Open Data, Training, and Evaluation': ['MCAP'],
  'EgoSuite-Open100K': ['LeRobot v3', 'MCAP'],
  'RoboMIND': ['HDF5'],
  'TouchAnything / EgoTouch': ['HDF5'],
  'EPIC-KITCHENS-100 / Rescaling Egocentric Vision': ['MP4 / video files'],
  'MobileEgo Anywhere/STERA/STERA-10M': ['MP4 / video files', 'HDF5'],
  'HomER v2: Home Egocentric Robotics Dataset': ['MP4 / video files', 'Parquet'],
  'Humanola Egocentric Hand-Pose Sample': ['MP4 / video files', 'Parquet'],
  'RekaDaily-10k (raw)': ['MP4 / video files'],
  'Ego4D': ['MP4 / video files'],
};

function inferDataFormats(name: string, value: string): DataFormat[] {
  const formats = new Set<DataFormat>(curatedDataFormats[name] || []);
  if (/\b(?:hdf5|h5)\b/i.test(value)) formats.add('HDF5');
  if (/\bmcap\b/i.test(value)) formats.add('MCAP');
  if (/\blerobot\s*v?3\b/i.test(value)) formats.add('LeRobot v3');
  if (/\b(?:rlds|tfds|tensorflow datasets?)\b/i.test(value)) formats.add('RLDS / TFDS');
  if (/\bparquet\b/i.test(value)) formats.add('Parquet');
  if (/\b(?:webdataset|\.tar\b)\b/i.test(value)) formats.add('WebDataset / TAR');
  if (/\b(?:jsonl|json)\b/i.test(value)) formats.add('JSON / JSONL');
  if (/\b(?:rosbag|ros bag)\b/i.test(value)) formats.add('ROS bag');
  if (/\b(?:\.mp4|mp4 files?)\b/i.test(value)) formats.add('MP4 / video files');
  return [...formats];
}

const curatedScale: Record<string, string> = {
  'Vinci2': '128.50 h total · 3,437 service instances · 10 categories · 4 temporal horizons · 15 EgoLife participant-days + 191 HoloAssist videos + 87 CaptainCook4D recordings',
};

const curatedAccess: Record<string, string> = {
  'Vinci2': 'Open code · EgoServe annotations on Hugging Face (CC BY 4.0)',
};

function rowsFromMarkdown(id: string, markdown: string, title: string): LibraryEntry[] {
  const lines = markdown.split(/\r?\n/);
  const entries: LibraryEntry[] = [];
  for (let index = 0; index < lines.length - 1; index += 1) {
    if (!lines[index].trim().startsWith('|') || !/^\s*\|?\s*:?-+/.test(lines[index + 1])) continue;
    const headers = lines[index].split('|').slice(1, -1).map((cell) => clean(cell).toLowerCase());
    const nameIndex = headers.findIndex((header) => /^(paper|company|person|organization|dataset|system|name)(\b|\s|\()/.test(header));
    if (nameIndex < 0) continue;
    const company = /^(company|organization)/.test(headers[nameIndex]);
    const person = headers[nameIndex].startsWith('person');
    for (index += 2; index < lines.length && lines[index].trim().startsWith('|'); index += 1) {
      const cells = lines[index].split('|').slice(1, -1).map(clean);
      if (cells.length < headers.length) continue;
      const value = (...names: string[]) => {
        const exact = headers.findIndex((header) => names.some((name) => header === name));
        const found = exact >= 0 ? exact : headers.findIndex((header) => names.some((name) => header.includes(name)));
        return found >= 0 ? cells[found] : '';
      };
      const nameLink = parseLink(cells[nameIndex]);
      const secondaryLink = parseLink(value('link', 'source', 'profile'));
      const linked = {...nameLink, url: nameLink.url === '#' ? secondaryLink.url : nameLink.url};
      const role = value('role', 'type') || (person ? 'Person' : company ? 'Organization' : 'Model');
      const venue = value('venue/year', 'venue', 'conference') || (person ? value('affiliation') : company ? value('region', 'us location') : '');
      const input = person ? value('affiliation') : company ? (value('focus') || value('region')) : value('input', 'sensor', 'modality');
      const output = person || company
        ? (value('evidence', 'recent works', 'works', 'data/sample', 'artifact') || value('output'))
        : value('output', 'target', 'artifact');
      const release = (person ? value('active years') : value('release', 'date')) || venue.match(/20\d{2}/)?.[0] || title.match(/20\d{2}/)?.[0] || '';
      const access = curatedAccess[linked.name] || (person ? 'Public profile' : value('access', 'availability', 'evidence') || (company ? value('evidence') : 'Paper/project page'));
      const scale = curatedScale[linked.name] || value('scale / resolution', 'scale/resolution', 'scale', 'size', 'count', 'team size') || '';
      const signalText = [input, output, value('signals', 'modalities'), role].join(' ');
      const taskText = [linked.name, input, output, scale, role].join(' ');
      const sceneText = [linked.name, input, output, scale, role, venue].join(' ');
      const inferredCamera = inferCamera([input, output, scale, access, value('signals', 'modalities')].join(' '));
      const cameraOverride = curatedCameraMetadata[linked.name];
      const camera = cameraOverride ? {camera: cameraOverride.camera, cameraGroup: cameraOverride.cameraGroup} : inferredCamera;
      const cameraView = cameraOverride?.cameraView || inferCameraView([input, scale, value('signals', 'modalities')].join(' '));
      const captureDevices = Array.from(new Set([
        ...inferCaptureDevices([linked.name, input, output, scale, access, value('signals', 'modalities')].join(' ')),
        ...(curatedCaptureDevices[linked.name] || []),
      ]));
      const robotInterfaces = Array.from(new Set([
        ...inferRobotInterfaces([linked.name, input, output, scale, role].join(' ')),
        ...(curatedRobotInterfaces[linked.name] || []),
      ]));
      const componentText = [linked.name, ...cells, value('components', 'dependencies', 'shared models')].join(' ');
      const components = inferComponents(componentText);
      const kinds = /^DreamDojo\b/i.test(linked.name)
        ? ['Dataset', 'Pipeline', 'General model'] as Kind[]
        : inferKinds(role, company, person, [linked.name, input, output, scale, role].join(' '));
      const tasks = inferTasks(taskText);
      const capabilities = inferCapabilities([linked.name, input, output, scale, role].join(' '), kinds);
      const geometryLayers = inferGeometryLayers([linked.name, input, output, scale, role].join(' '));
      const systemLayers = inferSystemLayers([linked.name, input, output, scale, role].join(' '));
      const libraryCategory = inferLibraryCategory(linked.name, venue, role);
      const agenticTags = id === 'agentic_rsi_embodied_ai'
        ? inferAgenticTags([linked.name, input, output, scale, role, access].join(' '))
        : {agenticWorkflows: [], agenticModules: [], agenticLayers: [], feedbackSignals: []};
      const agenticDesign = id === 'agentic_rsi_embodied_ai'
        ? describeAgenticDesign(agenticTags.agenticModules, agenticTags.feedbackSignals, agenticTags.agenticLayers)
        : '';
      const computeCost = id === 'agentic_rsi_embodied_ai' ? computeCostFor(linked.name) : '';
      const limitations = id === 'agentic_rsi_embodied_ai' ? limitationsFor(linked.name) : '';
      const companies = inferCompanies([linked.name, venue, input, output, scale, access].join(' '));
      const dataFormats = inferDataFormats(linked.name, [input, output, scale, access, ...cells].join(' '));
      const robotReferenceNames = /^(Bridge Data|FurnitureBench|DROID|RoboCasa|RoboMIND|REASSEMBLE|Dex1B|Open X-Embodiment \/ RT-X|RH20T|RoboAgent \/ RoboSet|Robo-DM|RoboTube|BridgeData V2|MimicGen|RIO|GEN-1(?:\.5)?:|PATO$|Learning Fine-Grained Bimanual Manipulation|Robot Data Curation|Curating Demonstrations using Online Experience|mimic-video$|ACE$)/i;
      const robotReference = robotReferenceNames.test(linked.name) || (/robot-native|robot trajectories|robot demonstrations/i.test([input, output, scale].join(' ')) && !/human-to-robot|human demonstrations? \+/i.test([linked.name, input, output].join(' ')));
      const sharedComponentReference = /^(VGGT:|MoGe:|WiLoR:)/i.test(linked.name);
      entries.push({
        id: `${id}::${linked.name}`,
        name: linked.name,
        url: linked.url,
        collection: id,
        collectionTitle: title,
        venue: venue || title,
        kinds,
        signals: inferSignals(signalText),
        tasks,
        ...inferScenes(sceneText, scale),
        sequenceDuration: sequenceDurationFor(linked.name, kinds),
        ...camera,
        cameraView,
        captureDevices,
        robotInterfaces,
        companies,
        dataFormats,
        capabilities,
        dataProvenance: inferDataProvenance(linked.name),
        referenceTags: sharedComponentReference ? ['Shared component reference'] : robotReference ? ['Robot reference'] : [],
        renderMethods: inferRenderMethods(linked.name),
        geometryLayers,
        systemLayers,
        libraryCategory,
        ...agenticTags,
        agenticDesign,
        computeCost,
        limitations,
        components,
        componentFamilies: inferComponentFamilies(components),
        inputGroups: inferInputGroups(input),
        outputGroups: inferOutputGroups(output),
        benchmarks: Array.from(new Set([...inferBenchmarks(componentText), ...curatedBenchmarks(linked.name)])),
        comparisonMetrics: inferComparisonMetrics(kinds, tasks),
        evaluations: curatedEvaluations(linked.name),
        input,
        output,
        release,
        access,
        accessGroup: accessGroup(access),
        scale,
        featured: linked.featured,
        impact: null,
        snapshot: null,
      });
    }
  }
  return entries;
}

export const entries = catalogData.records as unknown as LibraryEntry[];
export const collections: Collection[] = Array.from(new Set(entries.map((entry) => entry.collection))).map((id) => {
  const collectionEntries = entries.filter((entry) => entry.collection === id);
  return {
    id,
    title: collectionEntries[0]?.collectionTitle || id.replace(/_/g, ' '),
    updated: catalogData.updated,
    entries: collectionEntries,
  };
}).sort((a, b) => a.title.localeCompare(b.title));
export const kinds: Array<'All roles' | Kind> = ['All roles', 'Dataset', 'Pipeline', 'General model', 'Policy', 'Organization', 'Person'];
export const signals: Array<'All signals' | Signal> = ['All signals', 'RGB', '3D / pose', 'Contact', 'Gaze', 'IMU', 'Ego–exo', 'Language', 'Robot action'];
export const tasks: Array<'All tasks' | Task> = ['All tasks', 'Agentic RSI', 'Manipulation', 'Navigation', 'Locomotion', 'Teleoperation', 'Perception', 'Human motion', 'Assistance', 'Memory / QA', 'Generation / world model', 'General'];
export const sceneGroups: SceneGroup[] = ['Indoor', 'Outdoor', 'Tabletop / workbench', 'Room-scale / building', 'Industrial / warehouse', 'Kitchen / household', 'Office / social', 'Urban / road', 'Sports / skilled activity', 'Synthetic / simulation', 'Mixed / in-the-wild'];
export const renderMethods: RenderMethod[] = ['3D engine / simulator', 'Digital-twin rerender', 'Video diffusion / world model', 'View translation / neural rendering', 'Embodiment compositing'];
export const dataProvenances: DataProvenance[] = ['Real capture', 'Hybrid real + rerender', 'Synthetic simulation', 'Generated video'];
export const cameraOptions: Array<'All camera metadata' | CameraGroup> = ['All camera metadata', 'Calibration / intrinsics', 'Model family only'];
export const captureDevices: CaptureDevice[] = ['Meta Aria', 'Apple Vision Pro', 'GoPro', 'Insta360', 'iPhone / smartphone', 'Intel RealSense', 'Azure Kinect', 'ZED', 'HoloLens', 'VR / Quest headset', 'Other named capture rig'];
export const capabilities: Capability[] = ['Reconstruction / geometry', 'Rendering / novel view', 'Understanding / recognition', 'Tracking / localization', 'Generation / world model', 'Simulation', 'Retargeting / embodiment transfer', 'Policy learning / control', 'Data capture / annotation'];
export const geometrySubjects: GeometryLayer[] = ['Body reconstruction', 'Hand reconstruction', 'Object reconstruction', 'Human–object interaction (HOI)', 'Scene / environment reconstruction', 'Physics / dynamics'];
export const companyTags: Company[] = Array.from(new Set(companyRules.map((item) => item.name))).sort((a, b) => a.localeCompare(b));
export const dataFormats: DataFormat[] = ['MP4 / video files', 'HDF5', 'MCAP', 'LeRobot v3', 'RLDS / TFDS', 'Parquet', 'WebDataset / TAR', 'JSON / JSONL', 'ROS bag'];
export const sharedComponents: SharedComponent[] = ['Retargeting', 'Inverse kinematics (IK)', 'MANO', 'SMPL / SMPL-X', 'HaWoR', 'WiLoR', 'VGGT', 'MoGe', 'SLAM', 'DINOv2', 'DINOv3', 'SAM 2', 'SAM 3', 'Depth Anything 2', 'Depth Anything 3', 'FoundationPose', 'SpatialTracker', 'cuRobo'];
export const componentFamilies: ComponentFamily[] = ['DINO', 'SAM', 'Depth Anything', 'Retargeting / IK', 'Human body / hand', 'Geometry / tracking', 'Robot planning'];
export const inputGroups: InputGroup[] = ['RGB / video', 'Depth / RGB-D', 'Multiview', 'Language', 'Audio', 'Gaze', 'IMU', 'Hand / body pose', 'Robot state / action', 'Tactile / contact', 'Human demonstration', 'Synthetic / simulation', 'Other input'];
export const outputGroups: OutputGroup[] = ['Dataset / labels', 'Hand / body motion', '3D geometry / map', 'Camera / trajectory', 'Language / QA', 'Robot actions / demos', 'Policy / control', 'Generated media', 'Perception / tracking', 'Benchmark / evaluation', 'Other output'];
export const benchmarkCatalog: BenchmarkSpec[] = [
  {id: 'Ego4D', scope: 'Episodic memory · hands/objects · forecasting · AV/social', metrics: 'R@K at temporal IoU ↑ · mAP ↑ · top-K recall ↑ · trajectory error ↓', status: 'Challenge / board', url: 'https://ego4d-data.org/docs/challenge/'},
  {id: 'Ego-Exo4D', scope: 'Ego/exo pose · procedure and cross-view understanding', metrics: 'MPJPE ↓ · temporal IoU / F1 ↑ · recognition accuracy ↑', status: 'Challenge / board', url: 'https://ego4d-data.org/docs/challenge/'},
  {id: 'EPIC-KITCHENS', scope: 'Action recognition · anticipation · detection · retrieval', metrics: 'top-1 / top-5 accuracy ↑ · mean top-5 recall ↑ · mAP ↑', status: 'Challenge / board', url: 'https://epic-kitchens.github.io/2025'},
  {id: 'EgoSchema', scope: 'Long-form egocentric video multiple-choice QA', metrics: 'question accuracy ↑', status: 'Hosted board', url: 'https://github.com/egoschema/EgoSchema'},
  {id: 'HOT3D', scope: 'Egocentric hands and objects in 3D', metrics: 'hand / object pose error ↓ · detection / tracking score ↑', status: 'Public protocol', url: 'https://facebookresearch.github.io/hot3d/'},
  {id: 'HOI4D', scope: '4D hand-object interaction and action segmentation', metrics: 'segmentation F1 / edit ↑ · pose / reconstruction error ↓', status: 'Public protocol', url: 'https://hoi4d.github.io/'},
  {id: 'Assembly101', scope: 'Multiview procedural activity and action understanding', metrics: 'top-1 / top-5 accuracy ↑ · mean class accuracy ↑ · anticipation recall ↑', status: 'Public protocol', url: 'https://assembly-101.github.io/'},
  {id: 'FreiHAND', scope: 'In-the-wild 3D hand shape and pose reconstruction', metrics: 'PA-MPJPE / PA-MPVPE ↓ · F@5 / F@15 ↑', status: 'Public protocol', url: 'https://lmb.informatik.uni-freiburg.de/projects/freihand/'},
  {id: 'HO3D', scope: '3D hand-object pose and hand mesh reconstruction', metrics: 'AUC-J / AUC-V ↑ · PA-MPJPE / PA-MPVPE ↓', status: 'Public protocol', url: 'https://www.tugraz.at/index.php?id=40231'},
  {id: 'DexYCB', scope: 'Dexterous hand-object pose and reconstruction', metrics: 'MPJPE / PA-MPJPE ↓ · object ADD / ADD-S ↓', status: 'Public protocol', url: 'https://dex-ycb.github.io/'},
  {id: 'DTU', scope: 'Controlled multiview 3D reconstruction', metrics: 'surface accuracy / completeness / overall Chamfer ↓', status: 'Public protocol', url: 'https://roboimagedata.compute.dtu.dk/'},
  {id: 'ETH3D', scope: 'Multiview stereo and geometry reconstruction', metrics: 'accuracy / completeness error ↓ · F-score ↑', status: 'Hosted board', url: 'https://www.eth3d.net/'},
  {id: 'ScanNet', scope: 'Indoor RGB-D geometry, pose and correspondence', metrics: 'pose AUC@5/10/20 ↑ · depth / reconstruction error ↓', status: 'Public protocol', url: 'http://www.scan-net.org/'},
  {id: 'LIBERO', scope: 'Language-conditioned lifelong robot manipulation', metrics: 'binary task success % ↑ · four-suite average ↑', status: 'Public protocol', url: 'https://libero-project.github.io/'},
  {id: 'CALVIN', scope: 'Long-horizon language-conditioned manipulation', metrics: 'tasks completed in 1…5-step chains ↑ · mean chain length ↑', status: 'Hosted board', url: 'https://calvin.cs.uni-freiburg.de/'},
  {id: 'RLBench', scope: 'Few-shot and multitask robot manipulation', metrics: 'per-task success % ↑ under a fixed demo budget', status: 'Public protocol', url: 'https://sites.google.com/view/rlbench'},
  {id: 'Meta-World', scope: 'Multitask and meta-learning manipulation', metrics: 'task success % ↑ across fixed task / goal protocols', status: 'Public protocol', url: 'https://metaworld.farama.org/evaluation/evaluation/'},
  {id: 'ManiSkill', scope: 'Rigid, articulated and mobile manipulation', metrics: 'task success rate ↑ · normalized return ↑', status: 'Challenge / board', url: 'https://maniskill.ai/'},
  {id: 'RoboCasa', scope: 'Kitchen manipulation across seen and unseen tasks', metrics: 'atomic / composite seen / composite unseen success % ↑', status: 'Hosted board', url: 'https://robocasa.ai/leaderboard.html'},
  {id: 'BEHAVIOR', scope: 'Long-horizon household activities', metrics: 'goal-predicate completion ↑ · efficiency ↑ · disturbance / intervention ↓', status: 'Challenge / board', url: 'https://behavior.stanford.edu/challenge/'},
];
export const challengeCatalog: ChallengeSpec[] = [
  {name: 'HoloAssist · Mistake Detection', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Correct-vs-mistake classification from fine-grained collaborative manipulation context.', metrics: 'Binary action correctness accuracy', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'Ego4D · Episodic Memory / NLQ', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Find the response track in egocentric video for a natural-language query.', metrics: 'Temporal retrieval / localization', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'Ego4D · Forecasting', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Anticipate next active objects, verb, spatial positions and onset time.', metrics: 'Overall mAP', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'Ego4D · GoalStep', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Localize a described key step in untrimmed ego video.', metrics: 'R@1 at temporal IoU', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'Ego-Exo4D · Ego-Pose Body', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Estimate body pose from ego video and/or ego camera pose.', metrics: 'MPJPE ↓', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'Ego-Exo4D · Keysteps', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Infer procedure structure from natural video of skilled activity.', metrics: 'Official procedure-understanding protocol', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-KITCHENS · Action Recognition', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Classify verb and noun in a trimmed kitchen-action clip.', metrics: 'Top-1 / top-5 accuracy', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-KITCHENS · Action Detection', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Detect and recognize all action instances in untrimmed video.', metrics: 'Action-average mAP', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-KITCHENS · Domain Adaptation', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Classify target-domain actions using labeled source and unlabeled target video.', metrics: 'Action accuracy', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-KITCHENS · Multi-Instance Retrieval', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Search across vision and text modalities.', metrics: 'nDCG', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-KITCHENS · Semi-Supervised VOS', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Propagate first-frame object masks through a video subsequence.', metrics: 'Official video-object-segmentation protocol', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-SOUNDS · Interaction Recognition', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Recognize interactions from the audio stream.', metrics: 'Audio interaction classification', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-SOUNDS · Interaction Detection', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Recognize and temporally localize audio-based interactions.', metrics: 'Temporal audio-interaction detection', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EPIC-KITCHENS · Action Anticipation', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Predict a future action from the preceding video segment.', metrics: 'Official anticipation protocol', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'HD-EPIC · VQA', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Answer five-choice questions across seven HD-EPIC VQA types.', metrics: 'Multiple-choice accuracy', access: 'Official Codabench challenge', url: 'https://egovis.github.io/cvpr26/'},
  {name: 'EgoCross · Source-Limited + Open', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Cross-domain ego-video CloseQA across surgery, industry, sports and animal views.', metrics: 'Average accuracy over 957 four-choice VQAs', access: 'Two official Codabench tracks · resources public', url: 'https://egocross-benchmark.github.io/'},
  {name: 'CASTLE · Asynchronous VQA', host: 'EgoVis · CVPR', window: '2026-02–05 · held 2026-06-03', task: 'Answer four-choice questions over long, asynchronous multi-perspective content.', metrics: 'Question accuracy', access: 'Official Codabench challenge', url: 'https://castle-dataset.github.io/'},
  {name: 'ARNOLD', host: 'Embodied AI Workshop · CVPR', window: '2026-05–06 · held 2026-06-04', task: 'Language-grounded manipulation in Isaac Sim.', metrics: 'Task success under continuous control', access: 'Official workshop challenge', url: 'https://embodied-ai.org/cvpr2026/'},
  {name: 'ManiSkill-ViTac', host: 'Embodied AI Workshop · CVPR', window: '2026-05–06 · held 2026-06-04', task: 'Vision–tactile bimanual manipulation on a real robot.', metrics: 'Task success under continuous control', access: 'Official workshop challenge', url: 'https://embodied-ai.org/cvpr2026/'},
  {name: 'ManipArena', host: 'Embodied AI Workshop · CVPR', window: '2026-05–06 · held 2026-06-04', task: 'Desktop and mobile manipulation in simulation and on robot arms.', metrics: 'Task success under continuous control', access: 'Official workshop challenge', url: 'https://embodied-ai.org/cvpr2026/'},
  {name: 'Embodied Agent Interface', host: 'CVPR 2026 competition', window: '2026 edition', task: 'Goal interpretation, subgoal decomposition, action sequencing and transition modeling.', metrics: 'Logic-form F1 · simulator feasibility · goal satisfaction · planner compatibility', access: 'Public modules, leaderboards and evaluation scripts', url: 'https://eai-challenge-cvpr2026.github.io/'},
  {name: 'Robotic Grasping & Manipulation Competition', host: 'ICRA 2026', window: '2026-06-02–04', task: 'Picking in clutter, cloud manipulation and human–robot object handover.', metrics: 'Track-specific physical-task scores', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'What Bimanuals Can Do', host: 'ICRA 2026', window: '2026-06-01–04', task: 'Bimanual robotics competition.', metrics: 'Official competition protocol', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'RoboRacer Autonomous Racing', host: 'ICRA 2026', window: '2026-06-01–04', task: '1:10 autonomous racing: avoid crashes and minimize lap time.', metrics: 'Collision-free racing / lap time', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'LeHome · Garment Manipulation', host: 'ICRA 2026', window: '2026-06-01–02', task: 'Deformable garment manipulation in household scenarios.', metrics: 'Standardized garment-manipulation evaluation', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'REAL-I · Real-World Embodied AI Learning', host: 'ICRA 2026', window: '2026-06-01–04', task: 'Industrial dual-arm humanoid tasks: parts righting, bottle pick/place, package scanning.', metrics: 'Unified real-robot benchmark', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'AI for Robotic Surgery', host: 'ICRA 2026', window: '2026-06-02–04', task: 'dVRK peg transfer in teleoperated and autonomous modes.', metrics: 'Peg-transfer competition protocol', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'BARN Navigation Challenge', host: 'ICRA 2026', window: '2026-06-01–04', task: 'Navigate a Jackal through simulated and physical constrained environments.', metrics: 'Collision-free time-to-goal', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'AgiBot World Challenge', host: 'ICRA 2026', window: '2026-06-02–04', task: 'Humanoid World Model, VLM+VLA and whole-body-control tracks.', metrics: 'Track-specific integrated embodied evaluation', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
  {name: 'Legged Robot Challenges', host: 'ICRA 2026', window: '2026-06-01–04', task: 'Autonomous traversability and disaster-response conditions.', metrics: 'Dynamic terrain-traversal evaluation', access: 'Official ICRA competition', url: 'https://2026.ieee-icra.org/program/competitions/'},
];
export const creatorCaptureCatalog: CreatorCaptureSpec[] = [
  {name: 'EgoExo Forge · Pablo Vela', source: 'Independent creator / open-source pipeline', devices: 'iPhone + Insta360 GO', scope: 'Personal capture method intended for an ego–exo collection workflow.', evidence: 'Creator-reported; not a packaged or benchmarked dataset.', url: 'https://www.linkedin.com/posts/pablo-vela_introducing-egoexo-forge-built-on-top-activity-7348791072229142528-U95f'},
  {name: 'Kart telemetry experiment · Henry Zhang', source: 'Open-source creator project', devices: '1–2 × Insta360 GO 3S', scope: 'Wheel- and helmet-mounted video plus kart telemetry / IMU processing.', evidence: 'Repository-documented hardware; not a human–robot learning dataset.', url: 'https://github.com/caezium/kart-telemetry-experiment'},
  {name: 'Mobile sports capture method', source: 'Research / creator capture demonstration', devices: 'Insta360 One X2', scope: 'Backpack/chest-mounted first-person sports capture with an exocentric 360° stream.', evidence: 'Published capture-method report; not a reusable dataset release.', url: 'https://szollmann.github.io/assets/pdf/MobileHCI_LBWMobileSportsTutorials.pdf'},
];
export const accessOptions: Array<'All access' | LibraryEntry['accessGroup']> = ['All access', 'Open', 'Gated / request', 'Announced', 'Paper / code', 'Preview / claim'];
