import { Request, Response } from "express";
import { isUniqueCar, upsertCar, findAllCars, findCarsByCustomer } from "../../models/cars.model";
import { ICar } from "../../types";
import {
  hasRequiredCarFields,
  isValidCompanyId,
  isValidCustomerId,
} from "../../utils/validators.utils";
import { handleBadResponse, handleExceptionErrorResponse } from "../../utils/errors.utils";

async function httpGetAllCars(req: Request, res: Response) {
  try {
    let skip = req.query.skip ? +req.query.skip : 0;
    let take = req.query.take ? +req.query.take : 0;
    let searchTerm = req.query.searchTerm ? req.query.searchTerm.toString() : "";

    const cars = await findAllCars(skip, take, searchTerm);
    return res.status(200).json(cars);
  } catch (error) {
    return handleExceptionErrorResponse("get all cars", error, res);
  }
}

async function httpGetCarsByCustomer(req: Request, res: Response) {
  try {
    let customerId = req.query.customerId ? +req.query.customerId : 0;
    let searchTerm = req.query.searchTerm ? req.query.searchTerm.toString() : "";
    const cars = await findCarsByCustomer(searchTerm, customerId);
    return res.status(200).json(cars);
  } catch (error) {
    return handleExceptionErrorResponse("get all cars by customer", error, res);
  }
}

async function httpUpsertCar(req: Request, res: Response) {
  try {
    const carInfo: ICar = {
      id: req.body.id,
      brand: req.body.brand,
      licensePlate: req.body.licensePlate,
      model: req.body.model,
      year: req.body.year,
      mileage: req.body.mileage,
      color: req.body.color,
      vinNumber: req.body.vinNumber,
      carHasItems: req.body.carHasItems,
      carItemsDescription: req.body.carItemsDescription,
      companyId: req.companyId,
      customerId: req.body.customerId,
    };

    const hasRequiredFields = hasRequiredCarFields(carInfo);
    if (!hasRequiredFields) {
      return handleBadResponse(
        400,
        "Missing required fields to create/update car. Please provide the following fields: brand, licensePlate, model, year, mileage, color, vinNumber, companyId, customerId. Additionally assure that your numeric ids are in number format.",
        res
      );
    }

    const isCompanyIdValid = await isValidCompanyId(carInfo.companyId);
    if (!isCompanyIdValid) {
      return handleBadResponse(
        400,
        "The company Id provided is invalid or does not exist in the database. Please try again with a valid Id.",
        res
      );
    }

    const isCustomerIdValid = await isValidCustomerId(carInfo.customerId);
    if (!isCustomerIdValid) {
      return handleBadResponse(
        400,
        "The customer Id provided is invalid or does not exist in the database. Please try again with a valid Id.",
        res
      );
    }

    const isCarUnique = await isUniqueCar(carInfo.licensePlate, carInfo.vinNumber, carInfo.id);
    if (!isCarUnique) {
      return handleBadResponse(
        400,
        "Car does not have a unique license plate and/or vin number.",
        res
      );
    }

    const upsertedCar = await upsertCar(carInfo);
    res.status(200).json(upsertedCar);
  } catch (error) {
    return handleExceptionErrorResponse("upsert car", error, res);
  }
}

export { httpGetAllCars, httpGetCarsByCustomer, httpUpsertCar };
