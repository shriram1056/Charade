import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  allTeam: Array<Team>;
  DirectMessages: PaginatedDirectMessages;
  getTeamMembers: Array<Users>;
  Messages: PaginatedMessages;
  allUser: Array<Users>;
  User: Users;
  getUser?: Maybe<Users>;
  me?: Maybe<Users>;
};


export type QueryDirectMessagesArgs = {
  cursor?: Maybe<Scalars['String']>;
  receiverId: Scalars['Int'];
  teamId: Scalars['Int'];
};


export type QueryGetTeamMembersArgs = {
  teamId: Scalars['Int'];
};


export type QueryMessagesArgs = {
  cursor?: Maybe<Scalars['String']>;
  channelId: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['Float'];
  name: Scalars['String'];
  admin: Scalars['Boolean'];
  directMessageUsers?: Maybe<Array<User>>;
  channels?: Maybe<Array<Channel>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
};

export type Channel = {
  __typename?: 'Channel';
  id: Scalars['Float'];
  name: Scalars['String'];
  public: Scalars['Boolean'];
};

export type PaginatedDirectMessages = {
  __typename?: 'PaginatedDirectMessages';
  Messages: Array<DirectMessage>;
  hasMore: Scalars['Boolean'];
};

export type DirectMessage = {
  __typename?: 'DirectMessage';
  id: Scalars['Float'];
  text?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  fileType?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  receiverId: Scalars['Float'];
  sender: Users;
  team: Team;
};


export type Users = {
  __typename?: 'Users';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  team: Array<Team>;
};

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  Messages: Array<Message>;
  hasMore: Scalars['Boolean'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['Float'];
  text?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  fileType?: Maybe<Scalars['String']>;
  user: Users;
  createdAt: Scalars['DateTime'];
  channel: Channel;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTeam: TeamResponse;
  addTeamMember?: Maybe<AddUserResponse>;
  createChannel?: Maybe<ChannelResponse>;
  createDirectMessages: Scalars['Boolean'];
  createMessage: Message;
  addPicture: Scalars['Boolean'];
  createUser: UserResponse;
  Login: UserResponse;
};


export type MutationCreateTeamArgs = {
  name: Scalars['String'];
};


export type MutationAddTeamMemberArgs = {
  teamId: Scalars['Int'];
  email: Scalars['String'];
};


export type MutationCreateChannelArgs = {
  members: Array<Scalars['Int']>;
  public: Scalars['Boolean'];
  teamId: Scalars['Int'];
  name: Scalars['String'];
};


export type MutationCreateDirectMessagesArgs = {
  file?: Maybe<Scalars['Upload']>;
  teamId: Scalars['Int'];
  text?: Maybe<Scalars['String']>;
  receiverId: Scalars['Int'];
};


export type MutationCreateMessageArgs = {
  channelId: Scalars['Int'];
  file?: Maybe<Scalars['Upload']>;
  text?: Maybe<Scalars['String']>;
};


export type MutationAddPictureArgs = {
  channelId: Scalars['Int'];
  picture: Scalars['Upload'];
};


export type MutationCreateUserArgs = {
  options: UserCredentials;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type TeamResponse = {
  __typename?: 'TeamResponse';
  errors?: Maybe<FieldError>;
  team?: Maybe<Team>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type AddUserResponse = {
  __typename?: 'AddUserResponse';
  errors?: Maybe<FieldError>;
};

export type ChannelResponse = {
  __typename?: 'ChannelResponse';
  errors?: Maybe<FieldError>;
  channel?: Maybe<Channel>;
};


export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<FieldError>;
  user?: Maybe<Users>;
};

export type UserCredentials = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newDirectMessage: DirectMessage;
  newChannelMessage: Message;
};


export type SubscriptionNewDirectMessageArgs = {
  receiverId: Scalars['Int'];
  teamId: Scalars['Int'];
};


export type SubscriptionNewChannelMessageArgs = {
  channelId: Scalars['Int'];
};

export type FragmentErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type FragmentTeamFragment = (
  { __typename?: 'Team' }
  & Pick<Team, 'name'>
);

export type FragmentTeamResponseFragment = (
  { __typename?: 'TeamResponse' }
  & { errors?: Maybe<(
    { __typename?: 'FieldError' }
    & FragmentErrorFragment
  )>, team?: Maybe<(
    { __typename?: 'Team' }
    & FragmentTeamFragment
  )> }
);

export type FragmentUserFragment = (
  { __typename?: 'Users' }
  & Pick<Users, 'id' | 'username'>
);

export type FragmentUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<(
    { __typename?: 'FieldError' }
    & FragmentErrorFragment
  )>, user?: Maybe<(
    { __typename?: 'Users' }
    & FragmentUserFragment
  )> }
);

export type AddTeamMemberMutationVariables = Exact<{
  teamId: Scalars['Int'];
  email: Scalars['String'];
}>;


export type AddTeamMemberMutation = (
  { __typename?: 'Mutation' }
  & { addTeamMember?: Maybe<(
    { __typename?: 'AddUserResponse' }
    & { errors?: Maybe<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )> }
  )> }
);

export type AddPictureMutationVariables = Exact<{
  picture: Scalars['Upload'];
  channelId: Scalars['Int'];
}>;


export type AddPictureMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addPicture'>
);

export type CreateChannelMutationVariables = Exact<{
  teamId: Scalars['Int'];
  name: Scalars['String'];
  public: Scalars['Boolean'];
  members: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CreateChannelMutation = (
  { __typename?: 'Mutation' }
  & { createChannel?: Maybe<(
    { __typename?: 'ChannelResponse' }
    & { channel?: Maybe<(
      { __typename?: 'Channel' }
      & Pick<Channel, 'id' | 'name' | 'public'>
    )>, errors?: Maybe<(
      { __typename?: 'FieldError' }
      & FragmentErrorFragment
    )> }
  )> }
);

export type CreateDirectMessageMutationVariables = Exact<{
  text?: Maybe<Scalars['String']>;
  receiverId: Scalars['Int'];
  teamId: Scalars['Int'];
  file?: Maybe<Scalars['Upload']>;
}>;


export type CreateDirectMessageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createDirectMessages'>
);

export type CreateMessageMutationVariables = Exact<{
  channelId: Scalars['Int'];
  text?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['Upload']>;
}>;


export type CreateMessageMutation = (
  { __typename?: 'Mutation' }
  & { createMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'text' | 'url' | 'fileType'>
  ) }
);

export type CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateTeamMutation = (
  { __typename?: 'Mutation' }
  & { createTeam: (
    { __typename?: 'TeamResponse' }
    & FragmentTeamResponseFragment
  ) }
);

export type CreateUserMutationVariables = Exact<{
  options: UserCredentials;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'UserResponse' }
    & FragmentUserResponseFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { Login: (
    { __typename?: 'UserResponse' }
    & FragmentUserResponseFragment
  ) }
);

export type MessagesQueryVariables = Exact<{
  channelId: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { Messages: (
    { __typename?: 'PaginatedMessages' }
    & Pick<PaginatedMessages, 'hasMore'>
    & { Messages: Array<(
      { __typename?: 'Message' }
      & Pick<Message, 'id' | 'text' | 'createdAt' | 'url' | 'fileType'>
      & { user: (
        { __typename?: 'Users' }
        & Pick<Users, 'username'>
      ) }
    )> }
  ) }
);

export type AllUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUserQuery = (
  { __typename?: 'Query' }
  & { allUser: Array<(
    { __typename?: 'Users' }
    & Pick<Users, 'id' | 'email'>
  )> }
);

export type DirectMessageQueryVariables = Exact<{
  receiverId: Scalars['Int'];
  teamId: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type DirectMessageQuery = (
  { __typename?: 'Query' }
  & { DirectMessages: (
    { __typename?: 'PaginatedDirectMessages' }
    & Pick<PaginatedDirectMessages, 'hasMore'>
    & { Messages: Array<(
      { __typename?: 'DirectMessage' }
      & Pick<DirectMessage, 'id' | 'text' | 'createdAt' | 'url' | 'fileType'>
      & { sender: (
        { __typename?: 'Users' }
        & Pick<Users, 'username'>
      ) }
    )> }
  ) }
);

export type GetTeamMembersQueryVariables = Exact<{
  teamId: Scalars['Int'];
}>;


export type GetTeamMembersQuery = (
  { __typename?: 'Query' }
  & { getTeamMembers: Array<(
    { __typename?: 'Users' }
    & Pick<Users, 'id' | 'username' | 'email'>
  )> }
);

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser?: Maybe<(
    { __typename?: 'Users' }
    & Pick<Users, 'id' | 'username'>
    & { team: Array<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name' | 'admin'>
      & { directMessageUsers?: Maybe<Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      )>>, channels?: Maybe<Array<(
        { __typename?: 'Channel' }
        & Pick<Channel, 'id' | 'name' | 'public'>
      )>> }
    )> }
  )> }
);

export type GetUserDirectQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetUserDirectQuery = (
  { __typename?: 'Query' }
  & { User: (
    { __typename?: 'Users' }
    & Pick<Users, 'username'>
  ), getUser?: Maybe<(
    { __typename?: 'Users' }
    & Pick<Users, 'id' | 'username'>
    & { team: Array<(
      { __typename?: 'Team' }
      & Pick<Team, 'id' | 'name' | 'admin'>
      & { directMessageUsers?: Maybe<Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username'>
      )>>, channels?: Maybe<Array<(
        { __typename?: 'Channel' }
        & Pick<Channel, 'id' | 'name' | 'public'>
      )>> }
    )> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'Users' }
    & Pick<Users, 'id'>
  )> }
);

export type NewDirectMessageSubscriptionVariables = Exact<{
  receiverId: Scalars['Int'];
  teamId: Scalars['Int'];
}>;


export type NewDirectMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newDirectMessage: (
    { __typename?: 'DirectMessage' }
    & Pick<DirectMessage, 'id' | 'text' | 'createdAt'>
    & { sender: (
      { __typename?: 'Users' }
      & Pick<Users, 'username'>
    ) }
  ) }
);

export type NewChannelMessageSubscriptionVariables = Exact<{
  channelId: Scalars['Int'];
}>;


export type NewChannelMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newChannelMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'text' | 'createdAt'>
    & { user: (
      { __typename?: 'Users' }
      & Pick<Users, 'username'>
    ) }
  ) }
);

export const FragmentErrorFragmentDoc = gql`
    fragment FragmentError on FieldError {
  field
  message
}
    `;
export const FragmentTeamFragmentDoc = gql`
    fragment FragmentTeam on Team {
  name
}
    `;
export const FragmentTeamResponseFragmentDoc = gql`
    fragment FragmentTeamResponse on TeamResponse {
  errors {
    ...FragmentError
  }
  team {
    ...FragmentTeam
  }
}
    ${FragmentErrorFragmentDoc}
${FragmentTeamFragmentDoc}`;
export const FragmentUserFragmentDoc = gql`
    fragment FragmentUser on Users {
  id
  username
}
    `;
export const FragmentUserResponseFragmentDoc = gql`
    fragment FragmentUserResponse on UserResponse {
  errors {
    ...FragmentError
  }
  user {
    ...FragmentUser
  }
}
    ${FragmentErrorFragmentDoc}
${FragmentUserFragmentDoc}`;
export const AddTeamMemberDocument = gql`
    mutation AddTeamMember($teamId: Int!, $email: String!) {
  addTeamMember(teamId: $teamId, email: $email) {
    errors {
      field
      message
    }
  }
}
    `;
export type AddTeamMemberMutationFn = Apollo.MutationFunction<AddTeamMemberMutation, AddTeamMemberMutationVariables>;

/**
 * __useAddTeamMemberMutation__
 *
 * To run a mutation, you first call `useAddTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTeamMemberMutation, { data, loading, error }] = useAddTeamMemberMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddTeamMemberMutation(baseOptions?: Apollo.MutationHookOptions<AddTeamMemberMutation, AddTeamMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTeamMemberMutation, AddTeamMemberMutationVariables>(AddTeamMemberDocument, options);
      }
export type AddTeamMemberMutationHookResult = ReturnType<typeof useAddTeamMemberMutation>;
export type AddTeamMemberMutationResult = Apollo.MutationResult<AddTeamMemberMutation>;
export type AddTeamMemberMutationOptions = Apollo.BaseMutationOptions<AddTeamMemberMutation, AddTeamMemberMutationVariables>;
export const AddPictureDocument = gql`
    mutation addPicture($picture: Upload!, $channelId: Int!) {
  addPicture(picture: $picture, channelId: $channelId)
}
    `;
export type AddPictureMutationFn = Apollo.MutationFunction<AddPictureMutation, AddPictureMutationVariables>;

/**
 * __useAddPictureMutation__
 *
 * To run a mutation, you first call `useAddPictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPictureMutation, { data, loading, error }] = useAddPictureMutation({
 *   variables: {
 *      picture: // value for 'picture'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useAddPictureMutation(baseOptions?: Apollo.MutationHookOptions<AddPictureMutation, AddPictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPictureMutation, AddPictureMutationVariables>(AddPictureDocument, options);
      }
export type AddPictureMutationHookResult = ReturnType<typeof useAddPictureMutation>;
export type AddPictureMutationResult = Apollo.MutationResult<AddPictureMutation>;
export type AddPictureMutationOptions = Apollo.BaseMutationOptions<AddPictureMutation, AddPictureMutationVariables>;
export const CreateChannelDocument = gql`
    mutation CreateChannel($teamId: Int!, $name: String!, $public: Boolean!, $members: [Int!]!) {
  createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
    channel {
      id
      name
      public
    }
    errors {
      ...FragmentError
    }
  }
}
    ${FragmentErrorFragmentDoc}`;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      name: // value for 'name'
 *      public: // value for 'public'
 *      members: // value for 'members'
 *   },
 * });
 */
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const CreateDirectMessageDocument = gql`
    mutation CreateDirectMessage($text: String, $receiverId: Int!, $teamId: Int!, $file: Upload) {
  createDirectMessages(
    text: $text
    receiverId: $receiverId
    teamId: $teamId
    file: $file
  )
}
    `;
export type CreateDirectMessageMutationFn = Apollo.MutationFunction<CreateDirectMessageMutation, CreateDirectMessageMutationVariables>;

/**
 * __useCreateDirectMessageMutation__
 *
 * To run a mutation, you first call `useCreateDirectMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDirectMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDirectMessageMutation, { data, loading, error }] = useCreateDirectMessageMutation({
 *   variables: {
 *      text: // value for 'text'
 *      receiverId: // value for 'receiverId'
 *      teamId: // value for 'teamId'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateDirectMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateDirectMessageMutation, CreateDirectMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDirectMessageMutation, CreateDirectMessageMutationVariables>(CreateDirectMessageDocument, options);
      }
export type CreateDirectMessageMutationHookResult = ReturnType<typeof useCreateDirectMessageMutation>;
export type CreateDirectMessageMutationResult = Apollo.MutationResult<CreateDirectMessageMutation>;
export type CreateDirectMessageMutationOptions = Apollo.BaseMutationOptions<CreateDirectMessageMutation, CreateDirectMessageMutationVariables>;
export const CreateMessageDocument = gql`
    mutation createMessage($channelId: Int!, $text: String, $file: Upload) {
  createMessage(channelId: $channelId, text: $text, file: $file) {
    id
    text
    url
    fileType
  }
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      text: // value for 'text'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const CreateTeamDocument = gql`
    mutation CreateTeam($name: String!) {
  createTeam(name: $name) {
    ...FragmentTeamResponse
  }
}
    ${FragmentTeamResponseFragmentDoc}`;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, options);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const CreateUserDocument = gql`
    mutation createUser($options: UserCredentials!) {
  createUser(options: $options) {
    ...FragmentUserResponse
  }
}
    ${FragmentUserResponseFragmentDoc}`;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const LoginDocument = gql`
    mutation Login($password: String!, $email: String!) {
  Login(password: $password, email: $email) {
    ...FragmentUserResponse
  }
}
    ${FragmentUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      password: // value for 'password'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MessagesDocument = gql`
    query Messages($channelId: Int!, $cursor: String) {
  Messages(channelId: $channelId, cursor: $cursor) {
    hasMore
    Messages {
      id
      text
      user {
        username
      }
      createdAt
      url
      fileType
    }
  }
}
    `;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const AllUserDocument = gql`
    query allUser {
  allUser {
    id
    email
  }
}
    `;

/**
 * __useAllUserQuery__
 *
 * To run a query within a React component, call `useAllUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllUserQuery(baseOptions?: Apollo.QueryHookOptions<AllUserQuery, AllUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllUserQuery, AllUserQueryVariables>(AllUserDocument, options);
      }
export function useAllUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUserQuery, AllUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllUserQuery, AllUserQueryVariables>(AllUserDocument, options);
        }
export type AllUserQueryHookResult = ReturnType<typeof useAllUserQuery>;
export type AllUserLazyQueryHookResult = ReturnType<typeof useAllUserLazyQuery>;
export type AllUserQueryResult = Apollo.QueryResult<AllUserQuery, AllUserQueryVariables>;
export const DirectMessageDocument = gql`
    query DirectMessage($receiverId: Int!, $teamId: Int!, $cursor: String) {
  DirectMessages(receiverId: $receiverId, teamId: $teamId, cursor: $cursor) {
    hasMore
    Messages {
      id
      text
      sender {
        username
      }
      createdAt
      url
      fileType
    }
  }
}
    `;

/**
 * __useDirectMessageQuery__
 *
 * To run a query within a React component, call `useDirectMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useDirectMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDirectMessageQuery({
 *   variables: {
 *      receiverId: // value for 'receiverId'
 *      teamId: // value for 'teamId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useDirectMessageQuery(baseOptions: Apollo.QueryHookOptions<DirectMessageQuery, DirectMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DirectMessageQuery, DirectMessageQueryVariables>(DirectMessageDocument, options);
      }
export function useDirectMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DirectMessageQuery, DirectMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DirectMessageQuery, DirectMessageQueryVariables>(DirectMessageDocument, options);
        }
export type DirectMessageQueryHookResult = ReturnType<typeof useDirectMessageQuery>;
export type DirectMessageLazyQueryHookResult = ReturnType<typeof useDirectMessageLazyQuery>;
export type DirectMessageQueryResult = Apollo.QueryResult<DirectMessageQuery, DirectMessageQueryVariables>;
export const GetTeamMembersDocument = gql`
    query GetTeamMembers($teamId: Int!) {
  getTeamMembers(teamId: $teamId) {
    id
    username
    email
  }
}
    `;

/**
 * __useGetTeamMembersQuery__
 *
 * To run a query within a React component, call `useGetTeamMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamMembersQuery({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useGetTeamMembersQuery(baseOptions: Apollo.QueryHookOptions<GetTeamMembersQuery, GetTeamMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamMembersQuery, GetTeamMembersQueryVariables>(GetTeamMembersDocument, options);
      }
export function useGetTeamMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamMembersQuery, GetTeamMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamMembersQuery, GetTeamMembersQueryVariables>(GetTeamMembersDocument, options);
        }
export type GetTeamMembersQueryHookResult = ReturnType<typeof useGetTeamMembersQuery>;
export type GetTeamMembersLazyQueryHookResult = ReturnType<typeof useGetTeamMembersLazyQuery>;
export type GetTeamMembersQueryResult = Apollo.QueryResult<GetTeamMembersQuery, GetTeamMembersQueryVariables>;
export const GetUserDocument = gql`
    query getUser {
  getUser {
    id
    username
    team {
      id
      name
      admin
      directMessageUsers {
        id
        username
      }
      channels {
        id
        name
        public
      }
    }
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUserDirectDocument = gql`
    query getUserDirect($id: Int!) {
  User(id: $id) {
    username
  }
  getUser {
    id
    username
    team {
      id
      name
      admin
      directMessageUsers {
        id
        username
      }
      channels {
        id
        name
        public
      }
    }
  }
}
    `;

/**
 * __useGetUserDirectQuery__
 *
 * To run a query within a React component, call `useGetUserDirectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDirectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDirectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserDirectQuery(baseOptions: Apollo.QueryHookOptions<GetUserDirectQuery, GetUserDirectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserDirectQuery, GetUserDirectQueryVariables>(GetUserDirectDocument, options);
      }
export function useGetUserDirectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserDirectQuery, GetUserDirectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserDirectQuery, GetUserDirectQueryVariables>(GetUserDirectDocument, options);
        }
export type GetUserDirectQueryHookResult = ReturnType<typeof useGetUserDirectQuery>;
export type GetUserDirectLazyQueryHookResult = ReturnType<typeof useGetUserDirectLazyQuery>;
export type GetUserDirectQueryResult = Apollo.QueryResult<GetUserDirectQuery, GetUserDirectQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const NewDirectMessageDocument = gql`
    subscription NewDirectMessage($receiverId: Int!, $teamId: Int!) {
  newDirectMessage(receiverId: $receiverId, teamId: $teamId) {
    id
    text
    sender {
      username
    }
    createdAt
  }
}
    `;

/**
 * __useNewDirectMessageSubscription__
 *
 * To run a query within a React component, call `useNewDirectMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewDirectMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewDirectMessageSubscription({
 *   variables: {
 *      receiverId: // value for 'receiverId'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useNewDirectMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewDirectMessageSubscription, NewDirectMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewDirectMessageSubscription, NewDirectMessageSubscriptionVariables>(NewDirectMessageDocument, options);
      }
export type NewDirectMessageSubscriptionHookResult = ReturnType<typeof useNewDirectMessageSubscription>;
export type NewDirectMessageSubscriptionResult = Apollo.SubscriptionResult<NewDirectMessageSubscription>;
export const NewChannelMessageDocument = gql`
    subscription NewChannelMessage($channelId: Int!) {
  newChannelMessage(channelId: $channelId) {
    id
    text
    user {
      username
    }
    createdAt
  }
}
    `;

/**
 * __useNewChannelMessageSubscription__
 *
 * To run a query within a React component, call `useNewChannelMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewChannelMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewChannelMessageSubscription({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useNewChannelMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewChannelMessageSubscription, NewChannelMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewChannelMessageSubscription, NewChannelMessageSubscriptionVariables>(NewChannelMessageDocument, options);
      }
export type NewChannelMessageSubscriptionHookResult = ReturnType<typeof useNewChannelMessageSubscription>;
export type NewChannelMessageSubscriptionResult = Apollo.SubscriptionResult<NewChannelMessageSubscription>;