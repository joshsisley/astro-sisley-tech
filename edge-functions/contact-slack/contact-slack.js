import { encode } from "https://deno.land/std/encoding/base64.ts";

const { SLACK_CHANNEL_ID, SLACK_TOKEN } = Deno.env.toObject();

const formUrl = "https://slack.com/api/chat.postMessage";

export default async (request, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    Authorization: `Bearer ${SLACK_TOKEN}`,
  };

  const { email, name, message, topicEmail, topicChannel } =
    await request.json();

  if (!email || email === "") return Response.json({ error: "Missing email" });
  if (!message || message === "")
    return Response.json({ error: "Missing message" });
  if (!formUrl || formUrl === "")
    return Response.json({ error: "Missing formUrl" });

  const data = {
    channel: topicChannel ? topicChannel : SLACK_CHANNEL_ID,
    text: `Contact Form submission \n \n ${message}`,
    icon_emoji: ":ok_hand:",
  };

  try {
    const resp = await fetch(formUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const response = await resp.json();

    return Response.json({
      statusCode: 200,
      status: !!response?.ok ? "ok" : "error",
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return Response.json({
      error: " error",
    });
  }
};