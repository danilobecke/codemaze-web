export default {
    translations: {
        footer: {
            info: 'Informações do Sistema',
        },
        landing: {
            sign_in: 'Entrar',
            sign_up: 'Nova Conta'
        },
        sign_in: {
            title: 'Entrar',
            email: 'Email',
            password: 'Senha'
        },
        buttons: {
            cancel: 'Cancelar',
            send: 'Enviar',
            uploadFile: 'Selecionar Arquivo',
        },
        sign_up: {
            roleSelectionTitle: 'Selecione uma Função',
            manager: 'Sou Professor',
            student: 'Sou Aluno',
            managerTitle: 'Cadastro de Professor',
            studentTitle: 'Cadastro de Aluno',
            name: 'Nome Completo',
            email: 'Email',
            password: 'Senha',
            password_confirmation: 'Confirmar Senha'
        },
        groups: {
            title: 'Grupos',
            active: 'Ativo',
            inactive: 'Inativo',
            empty: 'Nenhum grupo...',
            new: 'Novo Grupo',
            join: 'Entrar no Grupo',
        },
        profile: {
            logOut: 'Sair',
        },
        new_group: {
            title: 'Novo Grupo',
            name: 'Nome',
        },
        join_group: {
            title: 'Entrar no Group',
            code: 'Código do Grupo',
        },
        snackbar: {
            success: 'Sucesso',
            error: 'Erro',
        },
        group: {
            code: 'Código',
            manager: 'Professor(a)',
            students: 'Alunos',
            tasks: 'Tarefas',
        },
        students_list: {
            requests: 'Pedidos para Participar',
            title: 'Alunos',
            active: 'Ativos',
            empty: 'Compartilhe o código do grupo com seus alunos.'
        },
        manage_request: {
            title: 'Confirmar',
            approve: 'Permitir que {{name}} entre no grupo.',
            refuse: 'Recusar a entrada de {{name}}.',
        },
        group_settings: {
            title: 'Configurações',
            active: 'Ativo',
            name: 'Nome',
        },
        tasks: {
            newTask: 'Nova Tarefa',
            title: 'Tarefas',
            empty: 'Nenhuma tarefa...',
            open: 'Tarefas iniciadas',
            closed: 'Tarefas encerradas',
            upcoming: 'Tarefas não iniciadas',
        },
        task: {
            start: 'Início',
            end: 'Término',
            maxAttempts: 'Máximo de tentativas permitidas',
            languages: 'Linguages permitidas',
            closed: 'Encerrada',
            submit: 'Enviar Código',
            details: 'Detalhes',
            tests: 'Testes',
            latestResult: 'Último Resultado',
            report: 'Relatório',
        },
        test_row: {
            test: 'Teste',
            input: 'Entrada',
            output: 'Saída',
            delete: 'Deletar',
        },
        tests: {
            newTest: 'Novo Teste',
            title: 'Testes',
            open: 'Testes Abertos',
            test: 'Teste',
            tests: 'Testes',
            closed: 'Testes Fechados',
            empty: 'Nenhum teste...',
        },
        test_deletion: {
            titleOpen: 'Confirmar exclusão do teste aberto {{position}}',
            titleClosed: 'Confirmar exclusão do teste fechado {{position}}',
        },
        new_test: {
            title: 'Novo Teste',
            input: 'Entrada',
            output: 'Saída',
            cardTitle: 'Teste {{position}}',
        },
        visibility_selector: {
            title: 'Tipo',
            open: 'Aberto',
            closed: 'Fechado',
        },
        new_task: {
            title: 'Nova Tarefa',
            tests: 'Testes',
            addTest: '+ adicionar teste',
        },
        add_task: {
            name: 'Título',
            details: 'Enunciado',
            startsOn: 'Início',
            endsOn: 'Término',
            maxAttempts: 'Máximo de tentativas permitidas',
            addLanguage: '+ adicionar linguagem permitida',
        },
        task_settings: {
            title: 'Atualizar Tarefa',
        },
        language_selector: {
            title: 'Linguagem permitida',
        },
        send_code: {
            title: 'Enviar Código',
            row: 'Arquivo',
        },
        result_details: {
            title: 'Resultado',
            numberAttempts: 'Número de tentativas: {{number}}',
            getCode: 'Download do código',
            open: 'Testes Abertos',
            closed: 'Testes Fechados',
            cardTitle: 'Teste {{index}}',
            cardSuccess: 'Sucesso 🚀',
            cardError: 'Erro ❌',
        },
        pie_chart: {
            success: 'Acertos %',
            error: 'Erros %',
        },
        report_details: {
            title: 'Relatório',
            overall: 'Geral',
            students: 'Alunos',
            tests: 'Testes',
        },
        overall_details: {
            submissionPercentage: 'Porcentagem de envios',
            submissions: 'Envios %',
            noSubmissions: 'Não enviados %',
            meanSuccess: 'Média de tentativas para obter sucesso em todos os testes',
            plagiarismReport: 'Abrir relatório de plágio',
            testsCardTitle: 'Testes com mais erros',
            openTests: 'Testes Abertos',
            closedTests: 'Testes Fechados',
            results: 'Resultados',
            students: 'Alunos (%)',
            result: 'Desempenho',
        },
        student_details: {
            attempts: 'Número de tentativas',
            downloadCode: 'Download do código',
            openResults: 'Testes Abertos',
            closedResults: 'Testes Fechados',
            wrongTests: 'Testes errados',
        },
        tests_details: {
            open: 'Testes Abertos',
            closed: 'Testes Fechados',
        },
        configs: {
            title: 'Informações do Sistema',
            aboutTitle: 'Sobre',
            aboutInfo: 'O Codemaze, concebido como trabalho de conclusão de curso (TCC) por Danilo Cleber Becke, é uma plataforma completa de educação em programação, especialmente projetada para aprimorar a experiência de aprendizado no ensino superior. Por meio de um ambiente virtual dedicado à execução de códigos, o Codemaze capacita os usuários, permitindo que os professores adicionem exercícios personalizados para os alunos resolverem, enquanto estes últimos têm a capacidade de submeter seus códigos para avaliação. Além de suas funcionalidades abrangentes, como diferenciação no cadastro para professores e alunos, gestão de turmas e a disponibilidade de exercícios customizáveis, a plataforma proporciona feedback imediato e relatórios detalhados. A sua simplicidade de instruções assegura uma implantação estável e segura.',
            languages: 'Linguagens de Programação Aceitas',
            name: 'Nome',
            extensions: 'Extensões de arquivo',
            help: 'Ajuda',
        },
        test_helper: {
            title: 'Ajuda',
            description: 'Faça download de um script para auxiliar na criação de testes.',
            download: 'Download',
        },
    }
}
