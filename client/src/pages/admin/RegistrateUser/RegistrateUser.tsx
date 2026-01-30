import AppContainer from '../../../components/ui/AppContainer';
import { useUserForm } from '../../../hooks/useUserForm';

import UserNameInput from '../../../widgets/user-registration/UserNameInput';
import UserEmailInput from '../../../widgets/user-registration/UserEmailInput';
import UserPasswordInput from '../../../widgets/user-registration/UserPasswordInput';
import OrganizationInput from '../../../widgets/user-registration/OrganizationInput';
import PhoneInput from '../../../widgets/user-registration/PhoneInput';
import ProgramSelector from '../../../widgets/user-registration/ProgramSelector';
import DiplomSection from '../../../widgets/user-registration/DiplomSection';
import SubmitSection from '../../../widgets/user-registration/SubmitSection';

import './RegistrateUser.css'

import myGif from '../../../assets/imgs/spinner.gif';

const RegistrateUser: React.FC = () => {
    const form = useUserForm();

    return (
        <AppContainer>
            {form.loaded ?
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
                :
                <div className="relative w-full h-full">
                    <img src={myGif} className="absolute top-1/2 left-1/2 -traslate-x-1/2 -translate-y-1/2"/>
                </div>

            }


        </AppContainer>
    );
};

export default RegistrateUser;
