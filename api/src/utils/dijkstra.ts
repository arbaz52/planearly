import find from "lodash/find";
import reduce from "lodash/reduce";
import sortBy from "lodash/sortBy";

import Flight from "../entity/flight";
import { Graph, Node, Routes } from "../types";

export const dijkstra = (from: string, to: string, graph: Graph) => {
  const explored: Node[] = [];
  let unexplored: Node[] = Object.keys(graph).map((cityId) => {
    if (cityId == from) {
      return {
        cityId,
        cost: 0,
      };
    } else {
      return {
        cityId,
        cost: Infinity,
      };
    }
  });
  while (unexplored.length > 0) {
    //sort and find the one with the least cost
    unexplored = sortBy(unexplored, (node) => node.cost);
    const [current] = unexplored.splice(0, 1);

    //put the least one in the explored and calculate distance
    explored.push(current);
    const currentDistance = current.cost;

    //go through each flight that departs from this city
    //for any flight that reduces the distance for previously calculated routes
    //update route accordingly
    const { cityId } = current;
    const flightsFrom = graph[cityId];
    flightsFrom.forEach((flight) => {
      const uNode = find(unexplored, (node) => node.cityId === flight.to.id);
      if (uNode && uNode.cost > currentDistance + flight.cost) {
        uNode.parent = flight;
        uNode.cost = currentDistance + flight.cost;
      }
    });
  }

  //with the explored nodes, it's a reverse linked list. connect flights and return plans.
  const cityIds = Object.keys(graph);
  const routes = reduce(
    cityIds,
    (prev, cityId) => {
      // for each city, generate flight plans.
      const plan: Flight[] = [];
      // find this city in explored
      // then track back to origin
      let currentCityId: string | undefined = cityId;
      let city;
      do {
        city = find(explored, (node) => node.cityId === currentCityId);
        if (city && city.parent) {
          plan.splice(0, 0, city.parent);
        }
        currentCityId = city?.parent?.from.id;
      } while (city);
      prev[cityId] = plan;
      return prev;
    },
    {} as Routes
  );
  return routes;
};
