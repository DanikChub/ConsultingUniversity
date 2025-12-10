import Button from "../ui/Button";

const SubmitSection = ({ navigate, createUser, params }: any) => (
    <div className="flex mt-4">
        <Button
            onClick={() => navigate(-1)}
            variant='red'
            className="add_input_button back admin_button"
        >
            Отменить
        </Button>

        <Button
            onClick={createUser}
            
        >
            {params.id ? 'Сохранить изменения' : 'Создать пользователя'}
        </Button>
    </div>
);

export default SubmitSection;
