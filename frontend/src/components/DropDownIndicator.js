import { components } from 'react-select';
import triangleDown from '../images/triange_down.png';

export default function DropdownIndicator(props){
    return (
        <components.DropdownIndicator {...props}>
        <img alt="" style={{ width: '22px' }} src={triangleDown} />
        </components.DropdownIndicator>
    )
}