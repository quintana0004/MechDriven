import { ICar } from "./../types/index.d";
import prisma from "../database/prisma";

async function findCarById(id: number) {
  try {
    const car = await prisma.car.findUnique({
      where: {
        id: id,
      },
    });

    return car;
  } catch (error) {
    throw error;
  }
}

async function upsertCar(carInfo: ICar) {
  try {
    const car = await prisma.car.upsert({
      where: {
        id: carInfo?.id ?? -1,
      },
      create: {
        brand: carInfo.brand,
        licensePlate: carInfo.licensePlate,
        model: carInfo.model,
        year: carInfo.year,
        mileage: carInfo.mileage,
        color: carInfo.color,
        vinNumber: carInfo.vinNumber,
        carHasItems: carInfo.carHasItems,
        carItemsDescription: carInfo.carItemsDescription,
        companyId: carInfo.companyId,
        customerId: Number(carInfo.customerId),
      },
      update: {
        brand: carInfo.brand,
        licensePlate: carInfo.licensePlate,
        model: carInfo.model,
        year: carInfo.year,
        mileage: carInfo.mileage,
        color: carInfo.color,
        vinNumber: carInfo.vinNumber,
        carHasItems: carInfo.carHasItems,
        carItemsDescription: carInfo.carItemsDescription,
        lastModified: new Date(),
      },
    });

    return car;
  } catch (error) {
    throw error;
  }
}

async function isUniqueCar(
  licensePlate: string,
  vinNumber: string,
  id: number | undefined
): Promise<boolean> {
  try {
    const car = await prisma.car.findFirst({
      where: {
        OR: [
          {
            licensePlate: licensePlate,
          },
          {
            vinNumber: vinNumber,
          },
        ],
      },
    });

    if (!car) {
      return true;
    } else if (car.id === id) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

async function findAllCars(
  skip: number,
  take: number,
  searchTerm: string | undefined
) {
  try {
    const plates = searchTerm ? searchTerm : undefined;
    const cars = await prisma.car.findMany({
      skip,
      take,
      where: {
        licensePlate: {
          contains: plates,
        },
      },
    });

    return cars;
  } catch (error) {
    throw error;
  }
}

async function findCarsByCustomer(
  licensePlate: string | undefined,
  customerId: number
) {
  try {
    const plates = licensePlate ? licensePlate : undefined;
    const clientCars = await prisma.car.findMany({
      where: {
        AND: [
          {
            licensePlate: {
              contains: plates,
            },
          },
          { customerId: customerId },
        ],
      },
    });

    return clientCars;
  } catch (error) {
    throw error;
  }
}

export { findCarById, upsertCar, isUniqueCar, findAllCars, findCarsByCustomer };
