import { atom, useAtom} from "jotai"

const ModalState = atom(false)

export const useCreateWorspaceModal = () => {
    return useAtom(ModalState)
}