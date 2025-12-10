import axios from "./mockApi";

export const fetchAssignments = async () => {
  try {
    const apiKey = process.env.REACT_APP_API_KEY;
    const response = await axios.get(`${apiKey}/assignments`);
    const fetchedAssignments = response.data;

    // Fetch course names for each assignment
    const updatedAssignments = await Promise.all(
      fetchedAssignments.map(async (assignment) => {
        const courseResponse = await axios.get(
          `${apiKey}/courses/${assignment.course}`
        );
        const courseName = courseResponse.name;
        return { ...assignment, course: courseName };
      })
    );

    return updatedAssignments;
  } catch (error) {
    console.error("Error:", error);
  }
};
