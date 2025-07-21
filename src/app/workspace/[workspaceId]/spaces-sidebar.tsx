import {
  AlertCircle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendIcon,
} from "lucide-react";

import { Item } from "@radix-ui/react-dropdown-menu";
import { UserItem } from "./user-item";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import WorkspaceIdLayout from "./layout";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCreateChannelModal } from "@/features/channels/api/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";

export const SpacesSideBar = () => {
  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#0f0f0f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex gap-y-2 flex-col bg-[#0f0f0f] h-full items-center justify-center">
        <AlertCircle className="size-5  text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#0f0f0f]">
      <WorkspaceHeader
        workspace={workspace}
        isadmin={member.role === "mentor"}
      />
      <div className="flex flex-col px-2 mt-3 ">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendIcon} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "mentor" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <div className="text-white" key={item._id}>
            <UserItem
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
              variant={item._id === memberId ? "active" : "default"}
            />
          </div>
        ))}
      </WorkspaceSection>
    </div>
  );
};
