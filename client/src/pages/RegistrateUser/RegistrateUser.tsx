import AppContainer from '../../components/ui/AppContainer';
import { useUserForm } from '../../hooks/useUserForm';

import UserNameInput from '../../components/RegistrateUser/UserNameInput';
import UserEmailInput from '../../components/RegistrateUser/UserEmailInput';
import UserPasswordInput from '../../components/RegistrateUser/UserPasswordInput';
import OrganizationInput from '../../components/RegistrateUser/OrganizationInput';
import PhoneInput from '../../components/RegistrateUser/PhoneInput';
import ProgramSelector from '../../components/RegistrateUser/ProgramSelector';
import DiplomSection from '../../components/RegistrateUser/DiplomSection';
import SubmitSection from '../../components/RegistrateUser/SubmitSection';

import './RegistrateUser.css'

const RegistrateUser: React.FC = () => {
    const form = useUserForm();

    return (
        <AppContainer>

            <div className="add_input_items">

                <UserNameInput {...form} />
                <UserEmailInput {...form} />
                <UserPasswordInput {...form} />
                <OrganizationInput {...form} />
                <PhoneInput {...form} />
                <ProgramSelector {...form} />
                <DiplomSection {...form} />

                <div className="login_form_message">{form.serverMessage}</div>

                <SubmitSection {...form} />
            </div>

        </AppContainer>
    );
};

export default RegistrateUser;
