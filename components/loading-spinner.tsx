import { Icons } from "./icons";

export default function LoadingSpinner() {

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
    )
}