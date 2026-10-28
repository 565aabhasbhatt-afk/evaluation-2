import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { initialData } from "./data/data";
import {
  loadData,
  saveData,
} from "./lib/storage";

import {
  normalizeData,
  calculateProgress,
  getStatus,
} from "./lib/SkillTracking.js";


const AppContext =
  createContext(null);


export function AppProvider({
  children,
}) {

  const [data, setData] =
    useState(
      normalizeData(initialData)
    );

  const [loaded, setLoaded] =
    useState(false);


  // Load saved data
  useEffect(() => {

    const savedData =
      loadData();

    setData(
      normalizeData(savedData)
    );

    setLoaded(true);

  }, []);


  // Save data automatically
  useEffect(() => {

    if (loaded) {
      saveData(data);
    }

  }, [data, loaded]);


  // Dark mode
  useEffect(() => {

    if (data.profile?.darkMode) {

      document.body.classList.add(
        "dark"
      );

    } else {

      document.body.classList.remove(
        "dark"
      );

    }

  }, [data.profile?.darkMode]);


  // Update general data
  function update(changes) {

    setData((oldData) => ({
      ...oldData,
      ...changes,
    }));

  }


  // Check / uncheck a task
  function toggleTask(
    skillId,
    taskId
  ) {

    setData((oldData) => {

      const skills =
        oldData.skills.map(
          (skill) => {

            if (
              skill.id !== skillId
            ) {
              return skill;
            }


            const tasks =
              skill.tasks.map(
                (task) => {

                  if (
                    task.id !== taskId
                  ) {
                    return task;
                  }

                  return {
                    ...task,
                    completed:
                      !task.completed,
                  };

                }
              );


            // Recalculate progress
            const progress =
              calculateProgress(
                tasks
              );


            return {
              ...skill,

              tasks,

              progress,

              paused: false,

              status: getStatus(
                progress,
                false
              ),
            };

          }
        );


      return {
        ...oldData,
        skills,
      };

    });

  }


  // Pause / resume skill
  function togglePause(
    skillId
  ) {

    setData((oldData) => {

      const skills =
        oldData.skills.map(
          (skill) => {

            if (
              skill.id !== skillId
            ) {
              return skill;
            }


            const paused =
              !skill.paused;


            return {
              ...skill,

              paused,

              status: getStatus(
                skill.progress,
                paused
              ),
            };

          }
        );


      return {
        ...oldData,
        skills,
      };

    });

  }


  // Delete skill
  function deleteSkill(
    skillId
  ) {

    setData((oldData) => ({

      ...oldData,

      skills:
        oldData.skills.filter(
          (skill) =>
            skill.id !== skillId
        ),

    }));

  }


  const value = {
    data,
    update,
    toggleTask,
    togglePause,
    deleteSkill,
  };


  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );

}


export function useApp() {

  return useContext(
    AppContext
  );

}