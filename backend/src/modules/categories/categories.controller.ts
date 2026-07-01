import { Request, Response, NextFunction } from "express";
import * as categoryService from "./categories.service";
import * as facilitiesService from "../facilities/facilities.service";
import { sendSuccess } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";

// ── Staff Categories ──

export async function listStaffCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.listStaffCategories(true);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAllStaffCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.listStaffCategories(false);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getStaffCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await categoryService.getStaffCategory(id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createStaffCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.createStaffCategory(req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_STAFF_CATEGORY",
      resource: "staff_category",
      resourceId: data.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateStaffCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await categoryService.updateStaffCategory(id, req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_STAFF_CATEGORY",
      resource: "staff_category",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function deleteStaffCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await categoryService.deleteStaffCategory(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_STAFF_CATEGORY",
      resource: "staff_category",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Staff category deleted" });
  } catch (err) {
    next(err);
  }
}

// ── Faculty Departments ──

export async function listFacultyDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.listFacultyDepartments(true);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAllFacultyDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.listFacultyDepartments(false);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getFacultyDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await categoryService.getFacultyDepartment(id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createFacultyDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.createFacultyDepartment(req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_FACULTY_DEPARTMENT",
      resource: "faculty_department",
      resourceId: data.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateFacultyDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await categoryService.updateFacultyDepartment(id, req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_FACULTY_DEPARTMENT",
      resource: "faculty_department",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function deleteFacultyDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await categoryService.deleteFacultyDepartment(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_FACULTY_DEPARTMENT",
      resource: "faculty_department",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Faculty department deleted" });
  } catch (err) {
    next(err);
  }
}

// ── Facility Categories ──

export async function listAllFacilityCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await facilitiesService.listAllFacilityCategories();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getFacilityCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await facilitiesService.getFacilityCategory(id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createFacilityCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await facilitiesService.createFacilityCategory(req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_FACILITY_CATEGORY",
      resource: "facility_category",
      resourceId: data.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateFacilityCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await facilitiesService.updateFacilityCategory(id, req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_FACILITY_CATEGORY",
      resource: "facility_category",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function deleteFacilityCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await facilitiesService.deleteFacilityCategory(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_FACILITY_CATEGORY",
      resource: "facility_category",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Facility category deleted" });
  } catch (err) {
    next(err);
  }
}
