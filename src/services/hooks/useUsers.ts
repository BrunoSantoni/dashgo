import { useQuery, UseQueryOptions } from "react-query";
import { api } from "../api";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type GetUsersResponse = {
  totalCount: number;
  users: User[];
};

export async function getUsers(currentPage: number): Promise<GetUsersResponse> {
    const { data, headers } = await api.get('users', {
      params: {
        page: currentPage,
      }
    });

    const totalCount = Number(headers['x-total-count']);

    // Trazer os dados já formatados
    /* Cache local é automático -> Stale while Revalidate... A chamada para a API é feita enquanto dados 'obsoletos' são mostrados em tela
    Apenas para evitar o usuário olhar uma tela branca, também já tem um revalidate on focus. */
    const users: User[] = data.users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      };
    });
    
    return { users, totalCount };
}

export function useUsers(currentPage: number) {
  return useQuery(['users', currentPage], () => getUsers(currentPage), {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}