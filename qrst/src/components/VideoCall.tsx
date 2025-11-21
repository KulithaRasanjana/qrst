import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID as string;
const TOKEN: string | null = null;

const VideoCall: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();
  const CHANNEL = channelName || "defaultChannel";

  const [joined, setJoined] = useState(false);

  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLDivElement | null>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);

  // Join Call
  const joinCall = async () => {
    clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    await clientRef.current.join(APP_ID, CHANNEL, TOKEN, null);
    setJoined(true);

    const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    localTracksRef.current = localTracks;

    // Play local video
    if (localVideoRef.current) {
      localTracks[1].play(localVideoRef.current);
    }

    await clientRef.current.publish(localTracks);

    clientRef.current.on("user-published", async (user, mediaType) => {
      await clientRef.current?.subscribe(user, mediaType);

      if (mediaType === "video" && remoteVideoRef.current) {
        user.videoTrack?.play(remoteVideoRef.current);
      }
    });
  };

  // Leave Call
  const leaveCall = async () => {
    clientRef.current?.leave();

    // Stop tracks
    localTracksRef.current?.forEach((track) => track.stop());
    localTracksRef.current?.forEach((track) => track.close());

    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Agora Meeting: {CHANNEL}</h1>

      {!joined ? (
        <button
          onClick={joinCall}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700"
        >
          Join Call
        </button>
      ) : (
        <button
          onClick={leaveCall}
          className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-700"
        >
          Leave Call
        </button>
      )}

      {/* Invite Link Box */}
      {joined && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full max-w-lg">
          <p className="text-sm font-medium">Invite someone using this link:</p>

          <input
            readOnly
            value={window.location.href}
            className="w-full mt-2 p-2 bg-white border rounded"
          />

          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Copy Link
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full mt-8">
        <div
          className="w-full h-64 bg-black rounded-lg"
          ref={localVideoRef}
        ></div>

        <div
          className="w-full h-64 bg-gray-900 rounded-lg"
          ref={remoteVideoRef}
        ></div>
      </div>

      <div className="flex flex-col items-center p-6">
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go back
        </a>
      </div>

    </div>
  );
};

export default VideoCall;
