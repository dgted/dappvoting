use anchor_lang::prelude::*;


declare_id!("FKpQvWo2dKVaMhuT1miEKNL7XPnxP5Cw9HnC8pTjbxf6");

#[program]
pub mod voting_system {
    use super::*;

    pub fn create_poll(ctx: Context<CreatePoll>, title: String, options: Vec<String>) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.authority = *ctx.accounts.authority.key;
        poll.title = title;
        poll.options = options;
        poll.votes = vec![0; poll.options.len()];
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, selected_option: u8) -> Result<()> {
        let poll = &mut ctx.accounts.poll;

        require!(
            (selected_option as usize) < poll.options.len(),
            ErrorCode::InvalidOption
        );

        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.voted = true;
        vote_account.voter = ctx.accounts.voter.key();

        poll.votes[selected_option as usize] += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePoll<'info> {
    #[account(init, payer = authority, space = 8 + Poll::MAX_SIZE)]
    pub poll: Account<'info, Poll>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(selected_option: u8)]
pub struct Vote<'info> {
    #[account(mut)]
    pub poll: Account<'info, Poll>,

    #[account(
        init,
        payer = voter,
        seeds = [b"vote", poll.key().as_ref(), voter.key().as_ref()],
        bump,
        space = 8 + VoteAccount::SIZE
    )]
    pub vote_account: Account<'info, VoteAccount>,

    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Poll {
    pub authority: Pubkey,
    pub title: String,
    pub options: Vec<String>,
    pub votes: Vec<u32>,
}

impl Poll {
    pub const MAX_OPTIONS: usize = 10;
    pub const MAX_TITLE_LEN: usize = 64;
    pub const MAX_OPTION_LEN: usize = 32;

    pub const MAX_SIZE: usize = 
        32 + // authority
        4 + Self::MAX_TITLE_LEN + // title
        4 + (Self::MAX_OPTIONS * (4 + Self::MAX_OPTION_LEN)) + // options
        4 + (Self::MAX_OPTIONS * 4); // votes
}

#[account]
pub struct VoteAccount {
    pub voter: Pubkey,
    pub voted: bool,
}

impl VoteAccount {
    pub const SIZE: usize = 32 + 1; // voter + voted
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid option selected.")]
    InvalidOption,
}
