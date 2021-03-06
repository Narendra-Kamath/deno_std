import { test, runIfMain } from "./mod.ts";
import { bench, runBenchmarks } from "./bench.ts";

import "./bench_example.ts";

test(async function benching() {
  bench(function forIncrementX1e9(b) {
    b.start();
    for (let i = 0; i < 1e9; i++);
    b.stop();
  });

  bench(function forDecrementX1e9(b) {
    b.start();
    for (let i = 1e9; i > 0; i--);
    b.stop();
  });

  bench(async function forAwaitFetchDenolandX10(b) {
    b.start();
    for (let i = 0; i < 10; i++) {
      let r = await fetch("https://deno.land/");
      await r.text();
    }
    b.stop();
  });

  bench(async function promiseAllFetchDenolandX10(b) {
    const urls = new Array(10).fill("https://deno.land/");
    b.start();
    await Promise.all(
      urls.map(async (denoland: string) => {
        let r = await fetch(denoland);
        await r.text();
      })
    );
    b.stop();
  });

  bench({
    name: "runs100ForIncrementX1e6",
    runs: 100,
    func(b) {
      b.start();
      for (let i = 0; i < 1e6; i++);
      b.stop();
    }
  });

  bench(function throwing(b) {
    b.start();
    // Throws bc the timer's stop method is never called
  });

  await runBenchmarks({ skip: /throw/ });
});

runIfMain(import.meta);
