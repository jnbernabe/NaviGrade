export const STUDENTS = [
  {
    _id: "student1",
    firstName: "Alex",
    lastName: "Rivers",
    email: "alex@example.com",
    password: "password123",
    courses: ["course1", "course2", "course3"],
    assignments: ["assign1", "assign2", "assign3", "assign4", "assign5"],
  },
];

export const COURSES = [
  {
    _id: "course1",
    name: "Advanced Web Development",
    professor: "Dr. Sarah Smith",
    schedules: [
      { day: "Mon, Wed", startTime: "10:00", endTime: "11:30" },
    ],
    startDate: "2026-01-15T00:00:00.000Z",
    endDate: "2026-05-15T00:00:00.000Z",
    color: "#8b5cf6", // Violet
    memo: "Focus on React and Node.js",
    assignments: ["assign1", "assign2"],
  },
  {
    _id: "course2",
    name: "Data Structures & Algorithms",
    professor: "Prof. Alan Turing",
    schedules: [
      { day: "Tue, Thu", startTime: "14:00", endTime: "15:30" },
    ],
    startDate: "2026-01-16T00:00:00.000Z",
    endDate: "2026-05-16T00:00:00.000Z",
    color: "#06b6d4", // Cyan
    memo: "Prepare for technical interviews",
    assignments: ["assign3", "assign4"],
  },
  {
    _id: "course3",
    name: "UI/UX Design Principles",
    professor: "Jane Doe",
    schedules: [
      { day: "Fri", startTime: "09:00", endTime: "12:00" },
    ],
    startDate: "2026-01-17T00:00:00.000Z",
    endDate: "2026-05-17T00:00:00.000Z",
    color: "#eab308", // Yellow for contrast
    memo: "Final project needs a prototype",
    assignments: ["assign5"],
  },
];

export const ASSIGNMENTS = [
  {
    _id: "assign1",
    name: "Portfolio Website",
    dueDate: "2026-02-15T23:59:59.000Z",
    course: "course1",
    grade: 95,
    weight: 0.2,
    student: "student1",
    completed: true,
    memo: "Use React and mocked backend",
    priority: 1,
  },
  {
    _id: "assign2",
    name: "API Integration",
    dueDate: "2026-03-10T23:59:59.000Z",
    course: "course1",
    grade: 0,
    weight: 0.3,
    student: "student1",
    completed: false,
    memo: "Connect to third-party API",
    priority: 2,
  },
  {
    _id: "assign3",
    name: "Sorting Algorithms",
    dueDate: "2026-02-20T23:59:59.000Z",
    course: "course2",
    grade: 88,
    weight: 0.15,
    student: "student1",
    completed: true,
    memo: "Implement Merge Sort and Quick Sort",
    priority: 1,
  },
  {
    _id: "assign4",
    name: "Binary Trees",
    dueDate: "2026-04-05T23:59:59.000Z",
    course: "course2",
    grade: 0,
    weight: 0.25,
    student: "student1",
    completed: false,
    memo: "Traversal techniques",
    priority: 3,
  },
  {
    _id: "assign5",
    name: "Wireframe Design",
    dueDate: "2026-02-01T23:59:59.000Z",
    course: "course3",
    grade: 92,
    weight: 0.2,
    student: "student1",
    completed: true,
    memo: "Figma prototype",
    priority: 1,
  },
];
