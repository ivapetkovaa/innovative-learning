import express from "express";

export default (router: express.Router) =>
  router.post("/compileCode", (req: express.Request, res: express.Response) => {
    fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    })
      .then((response: any) => response.json())
      .then((data: any) => res.json(data))
      .catch((err: any) => res.status(500).json({ error: err.message }));
  });
