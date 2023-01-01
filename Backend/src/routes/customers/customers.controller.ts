import { Request, Response } from "express";

import { ICustomer } from "./../../types/index.d";
import { handleBadResponse, handleExceptionErrorResponse } from "../../utils/errors.utils";
import {
  upsertCustomer,
  findAllCustomers,
  findAllCustomersWithActiveJobOrders,
} from "../../models/customers.model";
import { hasRequiredCustomerFields, isValidCompanyId } from "../../utils/validators.utils";

async function httpGetAllCustomers(req: Request, res: Response) {
  try {
    let skip = req.query.skip ? +req.query.skip : undefined;
    let take = req.query.take ? +req.query.take : undefined;
    let searchTerm = req.query.searchTerm ? req.query.searchTerm.toString() : "";
    let isActiveJobs = req.query.isActiveJobs;

    let customers = null;
    if (!!isActiveJobs) {
      customers = await findAllCustomersWithActiveJobOrders(skip, take, searchTerm);
    } else {
      customers = await findAllCustomers(skip, take, searchTerm);
    }

    return res.status(200).json(customers);
  } catch (error) {
    return handleExceptionErrorResponse("get all customers", error, res);
  }
}

async function httpUpsertCustomer(req: Request, res: Response) {
  try {
    const customerInfo: ICustomer = {
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      state: req.body.state,
      city: req.body.city,
      phone: req.body.phone,
      email: req.body.email,
      companyId: req.companyId,
    };

    const hasRequiredFields = hasRequiredCustomerFields(customerInfo);
    if (!hasRequiredFields) {
      return handleBadResponse(
        400,
        "Missing required fields to create/update customer. Please provide the following fields: firstName, lastName, addressLine1, city, phone and companyId.",
        res
      );
    }

    const isCompanyIdValid = await isValidCompanyId(customerInfo.companyId);
    if (!isCompanyIdValid) {
      return handleBadResponse(
        400,
        "The company Id provided is invalid or does not exist in the database. Please try again with a valid Id.",
        res
      );
    }

    const upsertedCustomer = await upsertCustomer(customerInfo);
    return res.status(200).json(upsertedCustomer);
  } catch (error) {
    return handleExceptionErrorResponse("upsert customer", error, res);
  }
}

export { httpGetAllCustomers, httpUpsertCustomer };
