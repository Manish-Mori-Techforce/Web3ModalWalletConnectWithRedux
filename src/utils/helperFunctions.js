export const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
        address.length - 4,
        address.length
    )}`;
};