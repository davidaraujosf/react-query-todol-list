import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import "./App.css";

function App() {
    const queryClient = useQueryClient();

    //Requesição para a fake API, chamando os dados data
    const { data, isLoading, error } = useQuery("todos", () =>
        axios
            .get("http://localhost:8080/todos")
            .then((response) => response.data)
    );
    //Criado para dar Toggle na atividade clickada, chamado no retorno da função. "onClick" abaixo
    const mutation = useMutation({
        mutationFn: ({ todoId, completed }) => {
            return axios
                .patch(`http://localhost:8080/todos/${todoId}`, {
                    completed,
                })
                .then((response) => response.data);
        },
        onSuccess: (data) => {
            //refetch manual somente do data, para não refazer a Query inteira novamente (caso ela seja pesada) e alterar o item clickado
            queryClient.setQueryData("todos", (currentData) =>
                currentData.map((todo) => (todo.id === data.id ? data : todo))
            );
        },
        onError: (error) => {
            console.error(error);
        },
    });

    //Loading retornado para a Query ser realizada, depois do "isLoading == false" o data consegue realizar o map
    //dá pra adicionar o "ikoneLoading" aqui quando o site tiver sendo desenvolvido
    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    //Adicionado para caso algo dê errado na requisição da API
    if (error) {
        return <div className="loading">Algo deu errado!</div>;
    }

    //mutation.isLoading: para fazer o gerenciamento de estado de Loading da nossa mutation

    return (
        <div className="app-container">
            <div className="todos">
                <h2>Todos & React Query</h2>
                {data.map((todo) => (
                    <div
                        onClick={() =>
                            mutation.mutate({
                                todoId: todo.id,
                                completed: !todo.completed,
                            })
                        }
                        className={`todo ${todo.completed && "todo-completed"}`}
                        key={todo.id}
                    >
                        {todo.title}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
