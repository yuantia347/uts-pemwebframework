import { getDataPublic, postDataPublic, deleteDataPrivate } from '@/lib/axios/axiosPublic';

export const fetchPlaylistById = async (id) =>
  await getDataPublic(`/api/playlist/${id}`);

export const addPlaylistToGroup = async (groupId, playlistData) =>
  await postDataPublic(`/api/playlist/${groupId}`, playlistData);

export const updatePlaylistById = async (idPlay, updatedData) =>
  await postDataPublic(`/api/playlist/update/${idPlay}`, updatedData);

export const deletePlaylistById = async (idPlay) =>
  await deleteDataPrivate(`/api/playlist/${idPlay}`);
