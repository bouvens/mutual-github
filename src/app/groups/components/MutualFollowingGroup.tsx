import { UserInlineList } from './UserInlineList';

interface MutualFollowingGroupProps {
  followers: { login: string; avatar_url: string }[];
}

export const MutualFollowingGroup: React.FC<MutualFollowingGroupProps> = ({
  followers,
}) => (
  <>
    <h2>Mutual Following ({followers.length})</h2>
    <UserInlineList followers={followers} />
  </>
);
