import { Request, Response, NextFunction } from "express";
import * as contactsService from "./contacts.service";
import { sendSuccess } from "../../utils/apiResponse";

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    await contactsService.createContact(req.body);
    sendSuccess(res, {
      message: "Thank you. We will respond within 1 working day.",
    }, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await contactsService.listContacts(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 20
    );
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await contactsService.markRead(Number(req.params.id));
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
