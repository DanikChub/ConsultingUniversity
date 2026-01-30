import AppContainer from '../../../components/ui/AppContainer';
import { useUserForm } from '../../../hooks/useUserForm';

import UserNameInput from '../../../widgets/user-registration/UserNameInput';
import UserEmailInput from '../../../widgets/user-registration/UserEmailInput';
import UserPasswordInput from '../../../widgets/user-registration/UserPasswordInput';
import PhoneInput from '../../../widgets/user-registration/PhoneInput';
import SubmitSection from '../../../widgets/user-registration/SubmitSection';


import myGif from '../../../assets/imgs/spinner.gif';
import UserRoleSelect from "../../../widgets/user-registration/UserRoleSelect";

const RegistrateUser: React.FC = () => {
    const form = useUserForm();

    return (
        <AppContainer>
            {form.loaded ?
                <div className="mt-[30px] w-full">

                    <UserNameInput {...form} />
                    <UserRoleSelect {...form}/>
                    <UserEmailInput {...form} />
                    <UserPasswordInput {...form} />
                    <PhoneInput {...form} />



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
