// Import your images at the top
import accountant from "../../../assets/Administrative Staffs/Accountant.webp";
import AdminHead from "../../../assets/Administrative Staffs/AdminHead.webp";
import BHMLabAssistant from "../../../assets/Administrative Staffs/BHMLabAssistant.webp";
import BSWFieldSupervisor from "../../../assets/Administrative Staffs/BSWFieldSupervisor.webp";
import ExamCoordinator from "../../../assets/Administrative Staffs/ExamCoordinator.webp";
import itCoordinator from "../../../assets/Administrative Staffs/ITCoordinator.webp";
import promotional from "../../../assets/Administrative Staffs/Promotion.webp";

// Default placeholder for missing images
const defaultProfile = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d6d3d1'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v2c0-2.66-5.33-4-8-4z'/></svg>";

export const staffData = {
  admin: [
    { name: "Mr. Hari Prasad Dhakal", role: "Administration Head", department: "Administration", image: AdminHead },
    { name: "Mrs. Pabitra Bista", role: "Accountant", department: "Finance & Accounts", image: accountant },
    { name: "Mr. Baburam Khatiwada", role: "Exam Co-ordinator", department: "Examinations", image: ExamCoordinator },
    { name: "Mr. Ravi Shah", role: "IT Co-ordinator", department: "Technical Support", image: itCoordinator },
    { name: "Mr. Nawal Rijal", role: "BSW Field Supervisor", department: "Social Work Dept", image: BSWFieldSupervisor },
    { name: "Mrs. Samjhana Khadka", role: "BHM Lab Assistant", department: "Hospitality Management", image: BHMLabAssistant },
    { name: "Mr. Sabin Magar", role: "Public Relation & Promotion Officer", department: "Communications", image: promotional },
    { name: "Mrs. Rejana Adhikari", role: "Library Co-ordinator", department: "Library", image: defaultProfile },
  ],
  bus: [
    { name: "Mr. Ramesh K.C.", role: "Driver", department: "Bus No: 01", image: defaultProfile },
    { name: "Mr. Arjun Thapa", role: "Assistant", department: "Bus No: 01", image: defaultProfile },
  ],
  security: [
    { name: "Mr. Bahadur Singh", role: "Head of Security", department: "Main Gate", image: defaultProfile },
  ],
  canteen: [
    { name: "Mrs. Sita Devi", role: "Head Chef", department: "Canteen Operations", image: defaultProfile },
  ]
};