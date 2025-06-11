import { getDataPublic, postDataPublic, deleteDataPrivate } from '@/lib/axios/axiosPublic';

const GROUP_ID = 41;

export const fetchPlaylistByGroup = async () =>
  await getDataPublic(`/api/playlist/${GROUP_ID}`);

export const addPlaylistToGroup = async (playlistData) =>
  await postDataPublic(`/api/playlist/${GROUP_ID}`, playlistData);

export const updatePlaylistById = async (idPlay, updatedData) =>
  await postDataPublic(`/api/playlist/update/${idPlay}`, updatedData);

export const deletePlaylistById = async (idPlay) =>
  await deleteDataPrivate(`/api/playlist/${idPlay}`);
