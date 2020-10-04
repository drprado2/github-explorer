import React, {FormEvent, useEffect, useState} from "react";
import {Form, Repositories, Title, Error} from "./styles";
import {FiChevronRight} from 'react-icons/fi';
import api from "../../services/api";
import {Link} from "react-router-dom";

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const repositoriesLocalstorageKey = '@GithubExplorer:repositories';

const Dashboard: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem(repositoriesLocalstorageKey)
        if (storageRepositories)
            return JSON.parse(storageRepositories)
        return [];
    });
    const [repoInput, setRepoInput] = useState('');
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (!repoInput) {
            setInputError('Digite o autor/nome do repositório');
            return;
        }

        try {
            const response = await api.get('/repos/' + repoInput);
            if (response.data)
                setRepositories([...repositories, response.data]);
            setInputError('');
            setRepoInput('');
        } catch (err) {
            console.error(err);
            setInputError('Repositório não encontrado!');
        }
    }

    return (
        <>
            <img src="https://xesque.rocketseat.dev/platform/1587379765556-attachment.svg" alt="Logo Github"/>
            <Title>Explore repositórios no Github.</Title>
            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input type="text" placeholder="Digite o nome do repositório" value={repoInput}
                       onChange={e => setRepoInput(e.target.value)}/>
                <button type="submit">Pesquisar</button>
            </Form>
            {
                inputError && <Error>{inputError}</Error>
            }
            <Repositories>
                {repositories.map(r => (
                    <Link key={r.full_name} to={`/repositories/${r.full_name}`}>
                        <img src={r.owner.avatar_url} alt={r.owner.login}/>
                        <div>
                            <strong>{r.full_name}</strong>
                            <p>{r.description}</p>
                        </div>
                        <FiChevronRight size={20}/>
                    </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard;