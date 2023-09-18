#!/usr/bin/env bash

set -xe

email="alexbird+$(date | md5)@hey.com"

pool_count="$(aws cognito-idp list-user-pools --max-results 2 --query "UserPools[].Name" --output text | wc -l | xargs)"
[[ "$pool_count" != "1" ]] && {
  echo "Expected only one user pool but found multiple."
  echo "If this is on purpose, you'll have to update $0 to filter by name"
  exit 1
}
user_pool_id="$(aws cognito-idp list-user-pools --max-results 1 --query "UserPools[?Name=='BirdFoodUsers'].Id | [0]" --output text)"
aws cognito-idp admin-create-user --user-pool-id "$user_pool_id" --username $email

