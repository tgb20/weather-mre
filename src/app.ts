/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import got from "got";

export default class HelloWorld {
  constructor(private context: MRE.Context) {
    this.context.onStarted(() => this.started());
  }

  private async started() {
    const promptButton = MRE.Actor.Create(this.context, {
      actor: {
        name: "promptButton",
        transform: { local: { position: { x: 0, y: 0, z: 0 } } },
        collider: {
          geometry: {
            shape: MRE.ColliderType.Box,
            size: { x: 0.5, y: 0.2, z: 0.01 },
          },
        },
        text: {
          contents: "Click to get weather for a city",
          height: 0.1,
          anchor: MRE.TextAnchorLocation.MiddleCenter,
          justify: MRE.TextJustify.Center,
        },
      },
    });

    promptButton.setBehavior(MRE.ButtonBehavior).onClick((user) => {
      user
        .prompt("Enter a city name only, i.e., Boston", true)
        .then(async (res) => {
          if (res.submitted) {
            let city = res.text;

            const { weather, main } = await got
              .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=imperial`
              )
              .json();

            let status = weather[0].main;
            let temp = main.temp;

            promptButton.text.contents = `The weather in ${city} is ${status} (${temp}° F)`;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
}
