// src/data/facultyData.js
const defaultProfile = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d6d3d1'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v2c0-2.66-5.33-4-8-4z'/></svg>";


export const facultyStaffData = {
  BCA: [
    { name: "Mr. Rajesh Sharma", role: "head Of Department", isHead: true, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    // ...
  ],
  BHM: [
    { name: "Mr. Bikram Rana", role: "Head Of Department", isHead: true, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
  ],
  BSW: [
    { name: "Mr. Bikram Rana", role: "Head Of Department", isHead: true, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
    { name: "Mrs. Sunita Rai", role: "Chef Instructor", isHead: false, image: defaultProfile },
    { name: "Ms. Anjali Thapa", role: "Lecturer (Java)", isHead: false, image: defaultProfile },
  ],
};