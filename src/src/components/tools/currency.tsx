import CurrencyFormat from 'react-currency-format';
export interface ICurrencyProps {
    value?: number
}
export const Currency = (props: ICurrencyProps) => {
    const {value} = props;
    return <CurrencyFormat value={value} displayType="text" thousandSeparator={true} suffix=" VNĐ" />
}