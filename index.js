import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

// site id = l0XScfRd

const updateJwplayerMedia = async (siteId, mediaId, customParams) => {
  const response = await axios({
    method: "PATCH",
    url: `https://api.jwplayer.com/v2/sites/${siteId}/media/${mediaId}/`,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: process.env.JWPLAYER_SECRET,
    },
    data: {
      metadata: {
        custom_params: {
          status: customParams.status,
          contentType: customParams.contentType,
          free: customParams.free,
          livestream_channel_id: customParams.livestream_channel_id,
          requires_authentication: customParams.requires_authentication,
        },
      },
    },
  })
    .then((response) => {
      return response.date;
    })
    .catch((error) => {
      if (error.response) {
        return {
          error: {
            status: error.response.status,
            data: error.response.data,
          },
        };
      } else {
        return "Error", error.message;
      }
    });
  return response;
};

const getJwplayerMedia = async (siteId, mediaId) => {
  const response = await axios({
    method: "get",
    url: `https://api.jwplayer.com/v2/sites/${siteId}/media/${mediaId}/`,
    headers: {
      accept: "application/json",
      Authorization: process.env.JWPLAYER_SECRET,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        return {
          error: {
            status: error.response.status,
            data: error.response.data,
          },
        };
      } else {
        return "Error", error.message;
      }
    });
  return response;
};

const isEmpty = (obj) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
};

const updateMedia = async (event) => {
  let media = await getJwplayerMedia(event.site_id, event.media_id);
  console.log(media);
  if (
    isEmpty(media.metadata.custom_params) ||
    media.metadata.custom_params.status === "VOD"
  ) {
    console.log("no data");
    return;
  }
  let customParams = media.metadata.custom_params;
  customParams.status = "VOD";
  let response = await updateJwplayerMedia(
    event.site_id,
    event.media_id,
    customParams
  );
  console.log(response);
  return response;
};

export const handler = async (event, context) => {
  if (event === "" || event === undefined) {
    return {
      message: "invalid event",
    };
  }
  console.log(event);
  return updateMedia(event);
};
