import prisma from "../database/prisma";
import { ITask } from "./../types/index.d";

async function findAllTasks(page: number, take: number) {
  try {
    const overFetchAmount = take * 2;
    const skipAmount = page * take;

    const tasks = await prisma.task.findMany({
      skip: skipAmount,
      take: overFetchAmount,
      orderBy: {
        dueDate: "asc",
      },
    });

    const tasksData = {
      data: tasks.slice(0, take),
      isLastPage: tasks.length <= take,
      currentPage: page,
    };
    return tasksData;
  } catch (error) {
    throw error;
  }
}

async function findTaskById(id: number) {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    return task;
  } catch (error) {
    throw error;
  }
}

async function createTask(taskInfo: ITask) {
  try {
    const task = await prisma.task.create({
      data: {
        text: taskInfo.text,
        dueDate: taskInfo.dueDate,
        companyId: taskInfo.companyId,
      },
    });

    return task;
  } catch (error) {
    throw error;
  }
}

async function deleteTask(id: number) {
  try {
    const task = await prisma.task.delete({
      where: {
        id: id,
      },
    });

    return task;
  } catch (error) {
    throw error;
  }
}

export { findAllTasks, findTaskById, createTask, deleteTask };
