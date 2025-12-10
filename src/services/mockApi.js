import { STUDENTS, COURSES, ASSIGNMENTS } from "../mockData";

// Simulate database in memory (resets on refresh, but acceptable for stateless demo)
// For persistence across refeshes, we could use localStorage, but let's start simple.
let students = [...STUDENTS];
let courses = [...COURSES];
let assignments = [...ASSIGNMENTS];

const MOCKED_DELAY = 50; // ms

// Helper to simulate async response
const mockResponse = (data, status = 200) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        // console.log("Mock API Response:", data);
      if (status >= 200 && status < 300) {
        resolve({ data, status, statusText: "OK" });
      } else {
        reject({ response: { data, status, statusText: "Error" } });
      }
    }, MOCKED_DELAY);
  });
};

const mockApi = {
  get: (url) => {
    // console.log("Mock API GET:", url);

    // Normalize URL to remove base URL if present
    const cleanUrl = url.replace(process.env.REACT_APP_API_KEY || "http://localhost:5050", "");
    
    // /users/signup or /users/login are posts, but checking just in case
    
    // Assignments
    if (cleanUrl === "/assignments") {
      return mockResponse(assignments);
    }
    const assignmentMatch = cleanUrl.match(/^\/assignments\/([a-zA-Z0-9]+)$/);
    if (assignmentMatch) {
      const id = assignmentMatch[1];
      const items = assignments.filter(a => a._id === id); // Should be find, but returning first
       return items.length ? mockResponse(items[0]) : mockResponse({ message: "Not found" }, 404);
    }
    
    // Assignments by Student
    // Assignments by Student
     const assignmentStudentMatch = cleanUrl.match(/^\/assignments\/student\/([a-zA-Z0-9]+)$/);
     if (assignmentStudentMatch) {
        const studentId = assignmentStudentMatch[1];
        // Filter by student field OR if the student has this assignment in their list
        // For the demo, let's keep it simple: filter by student field.
        const studentAssignments = assignments.filter(a => a.student === studentId);
        // console.log(`Assignments for student ${studentId}:`, studentAssignments);
        return mockResponse(studentAssignments);
     }

     // Completed Assignments by Student
     const completedAssignmentsStudentMatch = cleanUrl.match(/^\/completed-assignments\/([a-zA-Z0-9]+)$/);
     if (completedAssignmentsStudentMatch) {
        const studentId = completedAssignmentsStudentMatch[1];
        const studentCompleted = assignments.filter(a => a.student === studentId && a.completed);
        return mockResponse(studentCompleted);
     }


    // Courses
    if (cleanUrl === "/courses") {
      return mockResponse(courses);
    }
    const courseMatch = cleanUrl.match(/^\/courses\/([a-zA-Z0-9]+)$/);
    if (courseMatch) {
      const id = courseMatch[1];
      const item = courses.find(c => c._id === id);
      return item ? mockResponse(item) : mockResponse({ message: "Course not found" }, 404);
    }
    
    // Courses by Student
    const courseStudentMatch = cleanUrl.match(/^\/courses\/student\/([a-zA-Z0-9]+)$/);
    if(courseStudentMatch) {
        const studentId = courseStudentMatch[1];
        const student = students.find(s => s._id === studentId);
        if(student) {
             // Return courses that are in the student's courses array
             const studentCourses = courses.filter(c => student.courses.includes(c._id));
             return mockResponse(studentCourses);
        }
        return mockResponse([], 200);
    }

    return mockResponse({ message: "Not found" }, 404);
  },

  post: (url, body) => {
    // console.log("Mock API POST:", url, body);
    const cleanUrl = url.replace(process.env.REACT_APP_API_KEY || "http://localhost:5050", "");

    // LOGIN
    if (cleanUrl === "/users/login") {
        const user = students.find(s => s.email === body.email); // Simple password check ignored for mock
        // Always return success for the demo user if no match found for convenience? 
        // Or strictly match the mock data. Let's match mock data "alex@example.com"
        if (user || body.email === "alex@example.com") {
             const loggedUser = user || students[0];
             return mockResponse({ 
                 token: "mock-jwt-token", 
                 user: loggedUser 
             });
        }
         return mockResponse({ message: "Invalid credentials" }, 401);
    }

    // SIGNUP
    if (cleanUrl === "/users/signup") {
        const newUser = { ...body, _id: `student${Date.now()}`, courses: [], assignments: [] };
        students.push(newUser);
        return mockResponse({ token: "mock-jwt-token", user: newUser }, 201);
    }
    
    // LOGOUT
    if (cleanUrl === "/users/logout") {
        return mockResponse({ message: "Logged out" });
    }

    // ADD ASSIGNMENT
    if (cleanUrl === "/assignments" || cleanUrl === "/assignments/add-assignment") {
       const newAssignment = { 
           ...body, 
           _id: `assign${Date.now()}`,
           student: body.student || body.studentId || "student1",
           course: body.course || body.courseId,
           completed: body.completed || false
        };
       assignments.push(newAssignment);
       
       // Also update course and student arrays? 
       // In a real DB, this is relational. Here we just store in arrays.
       // The frontend likely expects the assignment object back.
       return mockResponse(newAssignment, 201);
    }

    // Mark Completed - Some routes are POST /:id/mark-completed
    // Mark Completed
    const markCompletedMatch = cleanUrl.match(/^\/assignments\/([a-zA-Z0-9]+)\/mark-completed$/);
    const completedAssignmentsMatch = cleanUrl.match(/^\/completed-assignments\/([a-zA-Z0-9]+)\/mark-completed$/);
    
    if(markCompletedMatch || completedAssignmentsMatch) {
        const id = markCompletedMatch ? markCompletedMatch[1] : completedAssignmentsMatch[1];
        const idx = assignments.findIndex(a => a._id === id);
        if(idx !== -1) {
            assignments[idx].completed = true;
            return mockResponse({ message: "Marked completed" });
        }
        return mockResponse({ message: "Not found" }, 404);
    }
    
    // Add Grade
    const addGradeMatch = cleanUrl.match(/^\/assignments\/([a-zA-Z0-9]+)\/add-grade$/);
    if(addGradeMatch) {
         const id = addGradeMatch[1];
         const idx = assignments.findIndex(a => a._id === id);
         if(idx !== -1) {
             assignments[idx].grade = body.score;
             assignments[idx].completed = true;
             return mockResponse({ message: "Grade added" });
         }
    }


    return mockResponse({ message: "Route not mocked" }, 404);
  },

  patch: (url, body) => {
    // console.log("Mock API PATCH:", url, body);
    const cleanUrl = url.replace(process.env.REACT_APP_API_KEY || "http://localhost:5050", "");
    
    const assignMatch = cleanUrl.match(/^\/assignments\/([a-zA-Z0-9]+)$/);
    if(assignMatch) {
        const id = assignMatch[1];
        const idx = assignments.findIndex(a => a._id === id);
        if(idx !== -1) {
            assignments[idx] = { ...assignments[idx], ...body };
            return mockResponse({ message: "Updated" });
        }
    }

    return mockResponse({ message: "Not found" }, 404);
  },

  delete: (url) => {
    // console.log("Mock API DELETE:", url);
    const cleanUrl = url.replace(process.env.REACT_APP_API_KEY || "http://localhost:5050", "");

    const assignMatch = cleanUrl.match(/^\/assignments\/([a-zA-Z0-9]+)$/);
    if(assignMatch) {
        const id = assignMatch[1];
        assignments = assignments.filter(a => a._id !== id);
         return mockResponse({ message: "Deleted" });
    }
    
    return mockResponse({ message: "Not found" }, 404);
  },

  put: (url, body) => {
    // console.log("Mock API PUT:", url, body);
    const cleanUrl = url.replace(process.env.REACT_APP_API_KEY || "http://localhost:5050", "");

    const markIncompleteMatch = cleanUrl.match(/^\/completed-assignments\/([a-zA-Z0-9]+)\/mark-incomplete$/);
    if(markIncompleteMatch) {
        const id = markIncompleteMatch[1];
        const idx = assignments.findIndex(a => a._id === id);
        if(idx !== -1) {
            assignments[idx].completed = false;
            return mockResponse({ message: "Marked incomplete" });
        }
        return mockResponse({ message: "Not found" }, 404);
    }
    
    // Default PUT behavior (update entire object)
    const assignMatch = cleanUrl.match(/^\/assignments\/([a-zA-Z0-9]+)$/);
    if(assignMatch) {
        const id = assignMatch[1];
        const idx = assignments.findIndex(a => a._id === id);
        if(idx !== -1) {
            assignments[idx] = { ...assignments[idx], ...body };
            return mockResponse({ message: "Updated" });
        }
    }

    return mockResponse({ message: "Route not mocked" }, 404);
  },
  
  // Axios compatibility
  defaults: {
    headers: {
      common: {}
    }
  }
};

export default mockApi;
